//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.InterviewQuestionsPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postIntQuest: ', event);
  console.log('event.body @ postIntQuest: ', event.body)
  console.log('context @ postIntQuest: ', context);

  const params = {
    Item: body,
    TableName: process.env.TABLE
  }
  console.log('params @ postIntQuest: ', params)
  dynamodb.putItem(params, function(err, intQuestToPost){    
    let response = {};
    if(err){
      response.statusCode = 502;
      response.body = JSON.stringify({
        message: 'There was an error calling Dynamo DB',
        error: err
      })
      response.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      callback(response)
    } else {
      console.log('intQuestToPost', intQuestToPost)
      response.statusCode = 200;
      response.body = JSON.stringify(intQuestToPost);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}