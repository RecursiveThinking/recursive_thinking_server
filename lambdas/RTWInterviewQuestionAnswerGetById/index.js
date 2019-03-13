// {
//   "pathParameters": {
//     "id": "fecc0b10-8f54-11e8-a926-e1e118251c18"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.InterviewQuestionAnswerGetById = (event, context, callback) => {
  console.log('event @ IntQuestAnsById Get', event);
  console.log('context @ IntQuestAnsById Get', context);
  
  const params = {
    Key: {
      Id: event.pathParameters.id
    },
    TableName: process.env.TABLE
  }
  dynamodb.get(params, function(err, intQuestAns){
    if(err){
      err.customStatus.statusCode = 501;
      err.customMessage.message = 'There was an Error Calling DynamoDB';
      err.customHeaders = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      console.log('err', err);
      callback(err);
    } else {
      let response = {};
      console.log('IntQuestAnsById: ', intQuestAns)
      console.log('IntQuestAnsById: ', intQuestAns.Item)
      response.statusCode = 200;
      response.body = JSON.stringify(intQuestAns);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // cb response
      callback(null, response)
    }
  })
}

// const AWS = require('aws-sdk');
// const dynamodb = new AWS.DynamoDB({
//   region: 'us-west-2', 
//   apiVerson: '2012-08-10'
// })

// exports.InterviewQuestionAnswerGetById = (event, context, callback) => {
//   console.log('event @ IntQuestAnsById Get', event);
//   console.log('context @ IntQuestAnsById Get', context);
  
//   const params = {
//     Key: {
//       'Id': {
//         // S: event.id
//         S: event.pathParameters.id
//       }
//     },
//     TableName: process.env.TABLE
//   }
//   dynamodb.getItem(params, function(err, intQuestAns){
//     let response = {};
//     if(err){
//       response.statusCode = 501;
//       response.body = JSON.stringify({
//         message: 'There was an Error Calling DynamoDB',
//         error: err
//       })
//       response.headers = {
//         'Content-Type': 'text/plain',
//         'Access-Control-Allow-Origin': '*'
//       }
//       console.log('err', response);
//       callback(response);
//     } else {
//       // good intQuestAns so unmarshall it
//       const intQuestAnsUnmarshalled = AWS.DynamoDB.Converter.unmarshall(intQuestAns.Item);
//       // build response object
//       response.statusCode = 200;
//       response.body = JSON.stringify(intQuestAnsUnmarshalled);
//       response.headers = {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       }
//       // cb response
//       callback(null, response)
//     }
//   })
// }