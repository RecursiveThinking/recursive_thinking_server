// {
//   "pathParameters": {
//     "id": "870d9780-8e21-11e8-ad35-63bc93d0cda55"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.InterviewQuestionGetById = (event, context, callback) => {
  // TODO implement
  console.log('event @ IntQuest Get', event);
  console.log('context @ IntQuest Get', context);
  
  const params = {
    Key: {
      Id: event.pathParameters.id
    },
    TableName: process.env.TABLE
  }
  dynamodb.get(params, function(err, intQuest){
    if(err){
      err.customStatus.statusCode = 501;
      err.customMessage.message = 'There was an Error Calling DynamoDB';
      err.customHeaders = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      console.log('err @ IntQuestGetById', err);
      callback(err);
    } else {
      let response = {}
      console.log('intQuest: ', intQuest)
      console.log('intQuest: ', intQuest.Item)
      response.statusCode = 200;
      response.body = JSON.stringify(intQuest);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response);
    }
  })
}





// const AWS = require('aws-sdk');
// const dynamodb = new AWS.DynamoDB({
//   region: 'us-west-2', 
//   apiVerson: '2012-08-10'
// })

// exports.InterviewQuestionGetById = (event, context, callback) => {
//   // TODO implement
//   console.log('event @ IntQuest Get', event);
//   console.log('context @ IntQuest Get', context);
  
//   const params = {
//     Key: {
//       'Id': {
//         // S: event.id
//         S: event.pathParameters.id
//       }
//     },
//     TableName: process.env.TABLE
//   }
//   dynamodb.getItem(params, function(err, intQuest){
//     let response = {}
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
//       // good intQuest so unmarshall it
//       const intQuestUnmarshalled = AWS.DynamoDB.Converter.unmarshall(intQuest.Item);
//       // build response object
//       response.statusCode = 200;
//       response.body = JSON.stringify(intQuestUnmarshalled);
//       response.headers = {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       }
//       // cb response
//       callback(null, response);
//     }
//   })
// }