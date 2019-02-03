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
# parser.add_argument("--website-directory", help="The directory of the website package (so we can dump secrets into it.", default=join('..', 'recursive_thinking_website'))
parser.add_argument("--website-directory", help="The directory of the website package (so we can dump secrets into it.", default=join('..', 'recursive_thinking_website_react_sandbox/recursive_thinking_website_react_cra/src/_credentials'))
parser.add_argument("--region", help="The AWS region to create your assets in.", default="us-west-2")
args = parser.parse_args()

assetsS3bucket = args.s3bucket
userAssetsS3Bucket = args.s3bucket

# create a (hopefully) unique s3bucket if none was defined

# CHANGED TWO PATHS HERE BECAUSE IM WORKING ON MY OWN
if assetsS3bucket == None:
    if sys.version_info < (3, 0):
        stripedUserName = check_output("git config --global user.email", shell=True).replace('@','-').replace('.', '-').rstrip()
        # assetsS3bucket = 'recursive-thinking-assets-' + args.region + '-' + stripedUserName
        assetsS3bucket = 'recursive-thinking-react-assets-' + args.region + '-' + stripedUserName        
        # userAssetsS3Bucket = 'rt-user-assets-' + args.region + '-' + stripedUserName
        userAssetsS3Bucket = 'rt-user-react-assets-' + args.region + '-' + stripedUserName
    else:
        stripedUserName = str(check_output("git config --global user.email", shell=True), 'utf-8').replace('@','-').replace('.', '-').rstrip()
        # assetsS3bucket = 'recursive-thinking-assets-' + args.region + '-' + stripedUserName
        assetsS3bucket = 'recursive-thinking-react-assets-' + args.region + '-' + stripedUserName
        # userAssetsS3Bucket = 'rt-user-assets-' + args.region + '-' + stripedUserName
        userAssetsS3Bucket = 'rt-user-react-assets-' + args.region + '-' + stripedUserName

# make the s3 bucket (seems to fail silently if the bucket is already made, so yay!)
call('aws s3 mb "s3://{0}" --region={1}'.format(assetsS3bucket, args.region), shell=True)

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
        call("aws s3 cp {0} s3://{1}/{2}/".format(zip_file_path, assetsS3bucket, build_dir), shell=True)
        
    # ------------------------------- END FOR PC -------------------------------
            
        # Do you want to see the .zip files?  IF SO, KEEP BELOW ON.  IF NOT, COMMENT BELOW OUT
        call("rm -f {0}".format(zip_file_path), shell=True)

# execute the cloudformation update
call("aws cloudformation deploy --s3-bucket={3} --template-file {1} --stack-name recursive-thinking-server-react{0} --capabilities=CAPABILITY_NAMED_IAM --parameter-overrides LambdaFolder={2} AssetsS3Bucket={3} UserAssetsS3Bucket={5} --region={4}".format(args.stage, args.template, build_dir, assetsS3bucket, args.region, userAssetsS3Bucket), shell=True)

# autoload users from json to Dynamo
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingUsers.json --region={0}".format(args.region), shell=True)
# autoload homeScreen quotes from json to Dynamo
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingHomeScreenQuotes.json --region={0}".format(args.region), shell=True)
# autoload ranks from json to Dynamo
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingRanks.json --region={0}".format(args.region), shell=True)
# autoload lessons from json to Dynamo
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingLessons.json --region={0}".format(args.region), shell=True)
# autoload lessons from json to Dynamo
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingInterviewQuestions.json --region={0}".format(args.region), shell=True)
# autoload lessons from json to Dynamo
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingInterviewQuestionsAnswers.json --region={0}".format(args.region), shell=True)
# autoload skills from json to Dynamo
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingProfileSkills1.json --region={0}".format(args.region), shell=True)
call("aws dynamodb batch-write-item --request-items file://db_fill/RecursiveThinkingProfileSkills2.json --region={0}".format(args.region), shell=True)


# get stack info
status = check_output("aws cloudformation describe-stacks --stack-name={0} --region={1}".format("recursive-thinking-server-react", args.region), shell=True)
stack_response = json.loads(status)
print(stack_response)

# this needs the api value (same as the APIURL below)
# This makes a "dev" Stage for the API and deploys it.
check_output('aws apigateway create-deployment --rest-api-id {0} --stage-name dev --region={1}'.format(stack_response["Stacks"][0]["Outputs"][4]["OutputValue"], args.region), shell=True)

#  Look for this in outputs
# 'Description': 'apiUrl - The base id of the api, used for constructing the api url to make requests'
credentials = {
    "region": args.region,
    "userPoolId": stack_response["Stacks"][0]["Outputs"][1]["OutputValue"],
    "userPoolWebClientId": stack_response["Stacks"][0]["Outputs"][2]["OutputValue"],
    "apiUrl": "https://{0}.execute-api.{1}.amazonaws.com/dev".format(stack_response["Stacks"][0]["Outputs"][4]["OutputValue"], args.region)
}

# 'Description': 's3BucketName - Name of s3 Bucket', 'ExportName': 's3BucketName', 
# Look for this in outputs
s3UploadInfo = {
    "region": args.region,
    "s3BucketName": stack_response["Stacks"][0]["Outputs"][3]["OutputValue"],
    "IdentityPoolId": stack_response["Stacks"][0]["Outputs"][0]["OutputValue"]
}

# print stack info in json format (so it can easily be copy-pasted)
credentialsString = json.dumps(credentials, indent=2, sort_keys=True)
s3UploadInfoString = json.dumps(s3UploadInfo, indent=2, sort_keys=True)
print('')
print('cognitoSecrets.json: ')
print(credentialsString)
print('')
print('s3UploadSecrets.json: ')
print(s3UploadInfoString)
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
    s3UploadSecretsPath = abspath(join(maybeWebsitePath, 'secrets', 's3UploadSecrets.json'))
    s3UploadSecrets = safeOpen(s3UploadSecretsPath,"w")
    s3UploadSecrets.write(s3UploadInfoString)
    s3UploadSecrets.close()

    print('Wrote secrets to {0}'.format(cognitoSecretsPath))
    print("If this isn't what you expected, please use the --website-directory argument.")
else:
    print("Failed to write secrets. Please write the secrets output above to recursive_thinking_website_react/secrets/cognitoSecrets.json and recursive_thinking_website_react/secrets/s3UploadSecrets.json")
    
# with cognito

# {'Stacks': [
    # {'StackId': 'arn:aws:cloudformation:us-west-2:918861449844:stack/recursive-thinking-server-react/5d611790-2728-11e9-ac91-0248fc62dc4e', 
    # 'LastUpdatedTime': '2019-02-02T20:23:18.648Z', 
    # 'Parameters': [
    #     {'ParameterValue': 'rt-user-react-assets-us-west-2-sethborne-gmail-com', 'ParameterKey': 'UserAssetsS3Bucket'}, {'ParameterValue': '20190202122225', 'ParameterKey': 'LambdaFolder'}, {'ParameterValue': 'recursive-thinking-react-assets-us-west-2-sethborne-gmail-com', 'ParameterKey': 'AssetsS3Bucket'}], 
    # 'Tags': [], 
    # 'Outputs': [
    #     {
    #         'Description': 'IdentityPoolId - Export for s3 Bucket', 
    #         'ExportName': 'RecursiveThinkingIdentityPoolS3Test::Id', 
    #         'OutputKey': 'CognitoIdentityPoolId', 
    #         'OutputValue': 'us-west-2:04b2f6e2-9ad5-4099-8149-464c88c92a9f'
    #     }, {
    #         'Description': 'userPoolId - The cognito user pool id', 
    #         'ExportName': 'CognitoUserPoolIdentifier', 
    #         'OutputKey': 'CognitoUserPoolId', 
    #         'OutputValue': 'us-west-2_3JORlFpAu'
    #     }, {
    #         'Description': 'userPoolWebClientId - The id of the client (app) connected to cognito', 
    #         'ExportName': 'CognitoUserPoolClientIdentifier', 
    #         'OutputKey': 'CognitoClientId', 
    #         'OutputValue': '492ajja9ng3rok3bu6gna8m1ar'
    #     }, {
    #         'Description': 's3BucketName - Name of s3 Bucket', 
    #         'ExportName': 's3BucketName', 
    #         'OutputKey': 's3BucketName', 
    #         'OutputValue': 'rt-user-react-assets-us-west-2-sethborne-gmail-com'
    #     }, {
    #         'Description': 'apiUrl - The base id of the api, used for constructing the api url to make requests', 'ExportName': 'APIGatewayIdentifier', 
    #         'OutputKey': 'APIGatewayId', 
    #         'OutputValue': '53e8p8bi8h'
    #     }
    # ], 
    # 'EnableTerminationProtection': False, 'CreationTime': '2019-02-02T20:23:13.214Z', 'Capabilities': ['CAPABILITY_NAMED_IAM'], 'StackName': 'recursive-thinking-server-react', 'NotificationARNs': [], 'StackStatus': 'CREATE_COMPLETE', 'DisableRollback': False, 'ChangeSetId': 'arn:aws:cloudformation:us-west-2:918861449844:changeSet/awscli-cloudformation-package-deploy-1549138991/7eafc408-f76e-4f88-99a6-6a1f768276b1', 'RollbackConfiguration': {}}]}

# {'Stacks': [
#     {
#         'StackId': 'arn:aws:cloudformation:us-west-2:918861449844:stack/recursive-thinking-server-react/36c76340-e6a1-11e8-93f6-500c33711099', 'LastUpdatedTime': '2018-11-12T17:52:20.345Z', 
#         'Parameters': [
#             {
#                 'ParameterValue': 'rt-user-react-assets-us-west-2-sethborne-gmail-com', 
#                 'ParameterKey': 'UserAssetsS3Bucket'
#             }, 
#             {
#                 'ParameterValue': '20181112095147', 
#                 'ParameterKey': 'LambdaFolder'
#             }, 
#             {
#                 'ParameterValue': 'recursive-thinking-react-assets-us-west-2-sethborne-gmail-com', 
#                 'ParameterKey': 'AssetsS3Bucket'
#             }
#         ], 
#         'Tags': [
            
#         ], 
#         'Outputs': [
#             {
#                 'Description': 's3BucketName - Name of s3 Bucket', 'ExportName': 's3BucketName', 
#                 'OutputKey': 's3BucketName', 
#                 'OutputValue': 'rt-user-react-assets-us-west-2-sethborne-gmail-com'
#             }, 
#             {   
#                 'Description': 'apiUrl - The base id of the api, used for constructing the api url to make requests', 
#                 'ExportName': 'APIGatewayIdentifier', 
#                 'OutputKey': 'APIGatewayId', 
#                 'OutputValue': '37wwxojca6'
#             }
#         ], 
#         'EnableTerminationProtection': False, 
#         'CreationTime': '2018-11-12T17:52:04.390Z', 
#         'Capabilities': [
#             'CAPABILITY_NAMED_IAM'
#         ], 
#         'StackName': 'recursive-thinking-server-react', 
#         'NotificationARNs': [], 
#         'StackStatus': 'CREATE_COMPLETE', 
#         'DisableRollback': False, 
#         'ChangeSetId': 'arn:aws:cloudformation:us-west-2:918861449844:changeSet/awscli-cloudformation-package-deploy-1542045118/94325c28-c7bb-4e43-a582-36c8e572aaf6', 'RollbackConfiguration': {}}]}
        
# Traceback (most recent call last):
#   File "./deployrtw.py", line 119, in <module>
#     check_output('aws apigateway create-deployment --rest-api-id {0} --stage-name Prod --region={1}'.format(stack_response["Stacks"][0]["Outputs"][4]["OutputValue"], args.region), shell=True)
# IndexError: list index out of range