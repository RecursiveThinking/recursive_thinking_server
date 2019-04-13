// {
//   "pathParameters": {
//     "Id": "9cdd7120-8ed0-11e8-b260-d5e4455e16bd"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.SkillGetById = (event, context, callback) => {
  // TODO implement
  console.log('event @ skill Get', event)
  console.log('context @ skill Get', context)
  const params = {
    Key: {
      id: event.pathParameters.id
    },
    TableName: process.env.TABLE
  }
  dynamodb.get(params, function(err, skill){
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
      let response = {}
      console.log('skill: ', skill)
      console.log('skill: ', skill.Item)
      response.statusCode = 200;
      response.body = JSON.stringify(skill);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // callback response
      callback(null, response)
    }
  })
}