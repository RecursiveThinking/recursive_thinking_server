# RTW Backend

## Prerequisites:

- [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

- [Install Postman](https://www.getpostman.com/)

- [Clone the Recursive Thinking Website](https://github.com/RecursiveThinking/recursive_thinking_website)

- Download a Python editor (e.g. [Pycharm]( https://www.jetbrains.com/pycharm/))

- Make sure you have Python 2.7+ (`python`)

## Developing

1. Make changes to the CloudFormation Template, or the Lambda Functions.
1. Run `./deployrtw.py`
3. Test your changes.
4. Repeat (probably).

### Node Lambda

If you can write your Lambda function in JS without importing npm, packages, no further additional config is needed. If, however, you need (or want) to import npm packages like `lodash` or `aws-amplify`, you'll need to add some lines to the `webpack.config.js` file.

For now, see the existing examples in `webpack.config.js` for how to add your function.

## Testing

Deploying to CloudFormation will expose an API endpoint. To test what it does, use a tool like Postman.
  1. [Install Postman](https://www.getpostman.com/) if you haven't.
  2. Open the API Gateway console and export Swagger with Postman Extension. (Only need to do this when you add/remove a new Method.)
      - Go to the API Gateway Console https://console.aws.amazon.com/apigateway/home
      - Select `RecursiveThinkingAPI`
      - Click `Stages`
      - Click the `Prod` stage
      - Click the `Export` tab
      - Hover over the Postman Logo (far right)
      - Click `JSON`
  3. Import the downloaded swagger into Postman.
  4. Clone and build the [Recursive Thinking Website](https://github.com/RecursiveThinking/recursive_thinking_website) if you haven't.
  2. Sign In / Sign Up to obtain Cognito Credential
  3. Open dev tools, Application under local storage find CognitoIdentityServiceProvider.idToken
  7. Add Authorization under headers and as value add the token from your local storage

### Login to AWS Console
1. Visit the Lambda Console and find the function that is invoked by your api test
2. Click test once on the Lambda page, should show an alert with a link to 'Logs'
3. Once on CloudWatch logs use Postman to test and check logs, change lambda code in
console and save.  When you are satisfied with code, change it in template.yml and
re-run the deployrtw.py script.

