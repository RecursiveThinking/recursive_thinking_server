#!/usr/bin/env python

import sys
import argparse
import os
import shutil
import time
import datetime
import subprocess
import json
# import time
from subprocess import call
from subprocess import check_output

s3BucketName = ''

if sys.version_info < (3, 0):
    s3BucketName = 'recursive-thinking-server-assets-' + check_output("git config --global user.email", shell=True).replace('@','-at-').replace('.', '-dot-').rstrip()
else:
    s3BucketName = 'recursive-thinking-server-assets-' + str(check_output("git config --global user.email", shell=True), 'utf-8').replace('@','-at-').replace('.', '-dot-').rstrip()

# Run this script from its directory in your cli:
# ./deployrtw.py --lambdas ./lambdas --template file://template.yml

parser = argparse.ArgumentParser("rtw")
parser.add_argument("--template", help="A file path to the CF template.  e.g. ./template.yml", default="./template.yml")
parser.add_argument("--assets", help="A file path to the lambdas folder e.g. ./lambdas", default="./lambdas")
parser.add_argument("--stage", help="Stage to deploy the stack to", default="")
parser.add_argument("--s3bucket", help="Name of the S3 bucket to deploy assets to", default=s3BucketName)
args = parser.parse_args()

build_dir = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d%H%M%S')

# make the s3 bucket (seems to fail silently if the bucket is already made, so yay!)
call('aws s3 mb "s3://{0}"'.format(args.s3bucket), shell=True)

# upload lambda assets
for subdir in os.listdir(args.assets):
    lambda_path = os.path.join(args.assets, subdir)

    if os.path.isdir(lambda_path):
        zip_file_path = shutil.make_archive(subdir, 'zip', lambda_path)
        call("aws s3 cp {0} s3://{1}/{2}/".format(zip_file_path, args.s3bucket, build_dir), shell=True)
        call("rm -f {0}".format(zip_file_path), shell=True)

# execute the cloudformation update
call("aws cloudformation deploy --template-file {1} --stack-name recursive-thinking-server{0} --capabilities=CAPABILITY_NAMED_IAM --parameter-overrides LambdaFolder={2} AssetS3Bucket={3}".format(args.stage, args.template, build_dir, args.s3bucket), shell=True)

# get stack info, print it
status = subprocess.check_output("aws cloudformation describe-stacks --stack-name {0}".format("recursive-thinking-server"), shell=True)
stack_response = json.loads(status)
print("Outputs:")
print(" {0} : {1}".format(stack_response["Stacks"][0]["Outputs"][0]["OutputKey"], stack_response["Stacks"][0]["Outputs"][0]["OutputValue"]))
print(" {0} : {1}".format(stack_response["Stacks"][0]["Outputs"][1]["OutputKey"], stack_response["Stacks"][0]["Outputs"][1]["OutputValue"]))
print(" {0} : {1}".format(stack_response["Stacks"][0]["Outputs"][2]["OutputKey"], stack_response["Stacks"][0]["Outputs"][2]["OutputValue"]))
print("BASE API URL : https://{0}.execute-api.us-west-2.amazonaws.com/Prod".format(stack_response["Stacks"][0]["Outputs"][2]["OutputValue"]))
