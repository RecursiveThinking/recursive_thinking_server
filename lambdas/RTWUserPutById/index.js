// {
//   "pathParameters": {
//     "userId": "9cdd7120-8ed0-11e8-b260-d5e4455e16bd"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.UserPutById = (event, context, callback) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ putUsers: ', event);
  console.log('event.body @ putUsers: ', event.body)
  console.log('body @ putUsers: ', body);
  console.log('context @ putUsers: ', context);
  
  const params = {
    Key: {
      'userId': body.userId
    },
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }
  
  console.log('params @ putUsers: ', params);
  
  dynamodb.update(params, function(err, userToEdit){
    if(err){
      let error = {}
      error.statusCode = 501;
      error.body = JSON.stringify({
        message: 'There was an error calling Dynamo DB',
        error: err
      })
      error.headers = {
        'Content-Type': 'text/plain', 
        'Access-Control-Allow-Origin': '*'
      }
      // callback(error);
      callback(err);
    } else {
      let response = {};
      console.log('userToEdit: ', userToEdit);
      // build response
      response.statusCode = 200;
      response.body = JSON.stringify(userToEdit.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response);
    }
  })
}