#!/usr/bin/env python

import argparse
import os
import shutil
import time
import datetime
import subprocess
import json
import time
from subprocess import call

# Run this script from its directory in your cli:
# ./deployrtw.py --lambdas ./lambdas --template file://template.yml


parser = argparse.ArgumentParser("rtw")
parser.add_argument("--template", help="A file path to the CF template.  e.g. file://template.yml", default="file://template.yml")
parser.add_argument("--lambdas", help="A file path to the lambdas folder e.g. ./lambdas", default="./lambdas")
parser.add_argument("--stage", help="Stage to deploy the stack to", default="")
args = parser.parse_args()

def check_stack_status(stack_name):
    status = subprocess.check_output("aws cloudformation describe-stacks --stack-name {0}".format(stack_name), shell=True)
    stack_response = json.loads(status)
    return str(stack_response["Stacks"][0]["StackStatus"])

time_stamp = time.time()
build_dir = datetime.datetime.fromtimestamp(time_stamp).strftime('%Y%m%d%H%M%S')

for subdir in os.listdir(args.lambdas):
    lambda_path = os.path.join(args.lambdas, subdir)

    if os.path.isdir(lambda_path):
        zip_file_path = shutil.make_archive(subdir, 'zip', lambda_path)
        s3_destination_path = "s3://rtwbackendbucket/{0}/".format(build_dir)
        subprocess.call("aws s3 cp {0} {1}".format(zip_file_path, s3_destination_path), shell=True)
        subprocess.call("rm -f {0}".format(zip_file_path), shell=True)

subprocess.call("aws cloudformation update-stack --stack-name rtwbackend{0} --capabilities=CAPABILITY_NAMED_IAM --template-body {1} --parameters ParameterKey=LambdaFolder,ParameterValue={2}".format(args.stage, args.template, build_dir), shell=True)

stack_status = check_stack_status("rtwbackend")
count = 0
while count < 100:
    count = count + 1
    time.sleep(1)
    stack_status = check_stack_status("rtwbackend")
    print(stack_status)
    if stack_status == "UPDATE_COMPLETE":
        print('Deployment Complete')
        break
    if stack_status == "CREATE_COMPLETE":
        print('Deployment Complete')
        break
    if stack_status == "UPDATE_ROLLBACK_COMPLETE":
        print('Deployment Unsuccessful')
        break
    if stack_status == "ROLLBACK_FAILED":
        print('Deployment Is Broken.  Go to AWS Console.')
        break
    if stack_status == "UPDATE_ROLLBACK_FAILED":
        print('Deployment Is Broken.  Go to AWS Console.')
        break
if count > 100:
    print('Polling aborted, stack deployment is taking too long.  Monitor from the AWS Console or call describe stack from the CLI.')
status = subprocess.check_output("aws cloudformation describe-stacks --stack-name {0}".format("rtwbackend"), shell=True)
stack_response = json.loads(status)
print("Outputs:")
print(" {0} : {1}".format(stack_response["Stacks"][0]["Outputs"][0]["OutputKey"], stack_response["Stacks"][0]["Outputs"][0]["OutputValue"]))
print(" {0} : {1}".format(stack_response["Stacks"][0]["Outputs"][1]["OutputKey"], stack_response["Stacks"][0]["Outputs"][1]["OutputValue"]))
print(" {0} : {1}".format(stack_response["Stacks"][0]["Outputs"][2]["OutputKey"], stack_response["Stacks"][0]["Outputs"][2]["OutputValue"]))
print("BASE API URL : https://{0}.execute-api.us-west-2.amazonaws.com/Prod".format(stack_response["Stacks"][0]["Outputs"][2]["OutputValue"]))
print('End of operation.  Goodbye.')
