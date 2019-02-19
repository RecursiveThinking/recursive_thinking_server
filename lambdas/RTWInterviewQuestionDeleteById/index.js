// {
//   "pathParameters": {
//     "id": "870d7070-8e21-11e8-ad35-63bc93d0cda5s"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.InterviewQuestionDeleteById = (event, context, callback) => {
  console.log('event @ IntQuestById Delete: ', event);
  console.log('event.body @ IntQuestById Delete: ', event.body);
  console.log('context @ IntQuestById Delete: ', context);
  
  const params = {
    Key: {
      'Id': event.pathParameters.id
    },
    ReturnValues: "ALL_OLD",
    TableName: process.env.TABLE
  }
  dynamodb.delete(params, function(err, intQuestDel){
    if(err){
      let error = {};
      error.statusCode = 501;
      error.body = JSON.stringify({
        message: 'There was an error calling DynamoDB',
        error: err
      })
      response.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      console.log('err', err);
      callback(err)
      // callback(error)
    } else {
      let response = {};
      response.statusCode = 200;
      response.body = JSON.stringify(intQuestDel.Attributes)
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}