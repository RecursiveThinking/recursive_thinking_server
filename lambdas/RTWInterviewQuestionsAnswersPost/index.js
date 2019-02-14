// {
//   "pathParameters": {
//     "id": "fecc0b10-8f54-11e8-a926-e1e118251c18"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.InterviewQuestionsAnswersPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postIntQuestAns: ', event);
  console.log('event.body @ postIntQuestAns: ', event.body)
  console.log('context @ postIntQuestAns: ', context);

  const params = {
    Item: body,
    TableName: process.env.TABLE
  }
  console.log('params @ postIntQuestAns: ', params)
  dynamodb.putItem(params, function(err, intQuestAnsToPost){    
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
      console.log('intQuestAnsToPost', intQuestAnsToPost)
      response.statusCode = 200;
      response.body = JSON.stringify(intQuestAnsToPost);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}