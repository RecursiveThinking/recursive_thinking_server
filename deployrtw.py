#!/usr/bin/env python

import sys
import argparse
import os
from os.path import abspath
from os.path import join
from os.path import dirname
from os.path import realpath
import posixpath
import shutil
import time
import datetime
import subprocess
import json
import colorama
from colorama import Fore, Style
import errno

colorama.init()

def call(*positional, **dictionary):
    print(Fore.BLUE + "exec: " + positional[0] + Style.RESET_ALL) # using print(locals()) will print all args as a dict/map
    subprocess.call(*positional, **dictionary)

def check_output(*positional, **dictionary):
    print(Fore.BLUE + "exec: " + positional[0] + Style.RESET_ALL) # using print(locals()) will print all args as a dict/map
    return subprocess.check_output(*positional, **dictionary)

# Run this script from its directory in your cli:
# ./deployrtw.py

parser = argparse.ArgumentParser("rtw")
parser.add_argument("--template", help="A file path to the CF template.  e.g. ./template.yml", default="./template.yml")
parser.add_argument("--assets", help="A file path to the lambdas folder e.g. ./lambdas", default="./lambdas")
parser.add_argument("--stage", help="Stage to deploy the stack to", default="")
parser.add_argument("--s3bucket", help="Name of the S3 bucket to deploy assets to")
parser.add_argument("--website-directory", help="The directory of the website package (so we can dump secrets into it.", default=join('..', 'recursive_thinking_website'))
parser.add_argument("--region", help="The AWS region to create your assets in.", default="us-west-2")
args = parser.parse_args()

s3bucket = args.s3bucket

# create a (hopefully) unique s3bucket if none was defined
if s3bucket == None:
    if sys.version_info < (3, 0):
        s3bucket = 'recursive-thinking-assets-' + args.region + '-' + check_output("git config --global user.email", shell=True).replace('@','-').replace('.', '-').rstrip()
    else:
        s3bucket = 'recursive-thinking-assets-' + args.region + '-' + str(check_output("git config --global user.email", shell=True), 'utf-8').replace('@','-').replace('.', '-').rstrip()

# make the s3 bucket (seems to fail silently if the bucket is already made, so yay!)
call('aws s3 mb "s3://{0}" --region={1}'.format(s3bucket, args.region), shell=True)

# upload lambda assets
# NOTE: we're using posixpath here for cross-compatibility b/c python doesn't seem to care
# and s3 needs the paths to be in posix format (i.e. Mac or Linux but not Windows)
build_dir = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d%H%M%S')
for subdir in os.listdir(args.assets):
    print("")
    # ------------------------------ START FOR MAC -----------------------------
    # -- IF YOU ARE ON MAC - TURN BTWN START/END ON AND BTWN START/END PC OFF --
    # lambda_path = posixpath.join(args.assets, subdir)

    # if posixpath.isdir(lambda_path):
    #     zip_file_path = shutil.make_archive(subdir, 'zip', lambda_path)
    #     call("aws s3 cp {0} s3://{1}/{2}/".format(zip_file_path, s3bucket, build_dir), shell=True)
    
    # ------------------------------- END FOR MAC ------------------------------
    
    # ------------------------------ START FOR PC ------------------------------
    # -- IF YOU ARE ON PC - TURN BTWN START/END ON AND BTWN START/END MAC OFF --
    lambda_path = "{0}/{1}".format(args.assets, subdir)

    if os.path.isdir(lambda_path):
        shutil.make_archive(subdir, 'zip', lambda_path)
        zip_file_path = "./{0}{1}".format(subdir, '.zip')
        call("aws s3 cp {0} s3://{1}/{2}/".format(zip_file_path, s3bucket, build_dir), shell=True)
        
    # ------------------------------- END FOR PC -------------------------------
            
        # Do you want to see the .zip files?  IF SO, KEEP BELOW ON.  IF NOT, COMMENT BELOW OUT
        call("rm -f {0}".format(zip_file_path), shell=True)

# execute the cloudformation update
call("aws cloudformation deploy --s3-bucket={3} --template-file {1} --stack-name recursive-thinking-server{0} --capabilities=CAPABILITY_NAMED_IAM --parameter-overrides LambdaFolder={2} AssetS3Bucket={3} --region={4}".format(args.stage, args.template, build_dir, s3bucket, args.region), shell=True)

# autoload skills from json to Dynamo
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingProfileSkillsProfessional.json")
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingProfileSkillsSoftware.json")
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingProfileSkillsLanguage.json")

# get stack info
status = check_output("aws cloudformation describe-stacks --stack-name={0} --region={1}".format("recursive-thinking-server", args.region), shell=True)
stack_response = json.loads(status)

check_output('aws apigateway create-deployment --rest-api-id {0} --stage-name Prod --region={1}'.format(stack_response["Stacks"][0]["Outputs"][2]["OutputValue"], args.region), shell=True)

credentials = {
    "region": args.region,
    "userPoolId": stack_response["Stacks"][0]["Outputs"][0]["OutputValue"],
    "userPoolWebClientId": stack_response["Stacks"][0]["Outputs"][1]["OutputValue"],
    "apiUrl": "https://{0}.execute-api.{1}.amazonaws.com/Prod".format(stack_response["Stacks"][0]["Outputs"][2]["OutputValue"], args.region)
}

# print stack info in json format (so it can easily be copy-pasted)
credentialsString = json.dumps(credentials, indent=2, sort_keys=True)
print('')
print('Secrets: ')
print(credentialsString)
print('')

# now try to put that into a file
# Check to see if the folder specified by the command is a real folder. 
# If it is, we write the secrets to it.
# If it isn't, print a warning.

def mkdirP(path):
    try:
        os.makedirs(path)
    except OSError as exc: # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else: raise

def safeOpen(path, mode):
    ''' Open "path" for writing, creating any parent directories as needed. '''
    mkdirP(os.path.dirname(path))
    return open(path, mode)

maybeWebsitePath = realpath(args.website_directory)

if os.path.isdir(maybeWebsitePath): # if maybeWebsitePath is a real folder...
    cognitoSecretsPath = abspath(join(maybeWebsitePath, 'secrets', 'cognitoSecrets.json'))
    cognitoSecrets = safeOpen(cognitoSecretsPath,"w")
    cognitoSecrets.write(credentialsString)
    cognitoSecrets.close()

    print('Wrote secrets to {0}'.format(cognitoSecretsPath))
    print("If this isn't what you expected, please use the --website-directory argument.")
else:
    print("Failed to write secrets. Please copy the secrets output above to recursive_thinking_website/secrets/cognitoSecrets.json")