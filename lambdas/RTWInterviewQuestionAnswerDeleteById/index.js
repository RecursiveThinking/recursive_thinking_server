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

exports.InterviewQuestionAnswerDeleteById = (event, context, callback) => {
  console.log('event @ IntQuestAnsById Delete', event);
  console.log('context @ IntQuestAnsbyId Delete', context);
  
  const params = {
    Key: {
      'Id': {
        // S: event.id
        S: event.pathParameters.id
      }
    },
    TableName: process.env.TABLE
  }
  dynamodb.deleteItem(params, function(err, intQuestAns){
    let response = {};
    if(err){
      response.statusCode = 501;
      response.body = JSON.stringify({
        message: 'There was an Error Calling DynamoDB',
        error: err
      })
      response.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      console.log('err', response);
      callback(response);
    } else {

      // build response object
      response.statusCode = 200;
      response.body = JSON.stringify({});
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // cb response
      callback(null, response)
    }
  })
}