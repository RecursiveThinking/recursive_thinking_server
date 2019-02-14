// {
//   "pathParameters": {
//     "id": "870d7070-8e21-11e8-ad35-63bc93d0cda5s"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.InterviewQuestionDeleteById = (event, context, callback) => {
  console.log('event @ IntQuestById Delete: ', event);
  console.log('context @ IntQuestById Delete: ', context);
  
  const params = {
    Key: {
      'Id': {
        // S: event.Id
        S: event.pathParameters.id
      }
    },
    TableName: process.env.TABLE
  }
  dynamodb.deleteItem(params, function(err, intQuestDel){
    let response = {};
    if(err){
      response.statusCode = 501;
      response.body = JSON.stringify({
        message: 'There was an error calling DynamoDB',
        error: err
      })
      response.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      console.log('err', response);
      callback(response)
    } else {
      const intQuestDelUnmarshalled = AWS.DynamoDB.Converter.unmarshall(intQuestDel.Item)
      console.log('intQuest @ delete', intQuestDelUnmarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // cb
      callback(null, response)
    }
  })
}