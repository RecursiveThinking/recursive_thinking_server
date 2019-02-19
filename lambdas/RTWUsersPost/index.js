//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.UsersPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postUsers: ', event);
  console.log('event.body @ postUsers: ', event.body)
  console.log('body @ postUsers: ', body);
  console.log('context @ postUsers: ', context);

  const params = {
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }

  console.log('params @ postUsers: ', params)
  
  dynamodb.update(params, function(err, userToPost){    
    if(err){
      let error = {};
      error.statusCode = 501;
      error.body = JSON.stringify({
        message: 'There was an error calling Dynamo DB',
        error: err
      })
      error.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      // callback(error)
      callback(err)
    } else {
      let response = {};
      console.log('userToPost', userToPost);
      // build response
      response.statusCode = 200;
      response.body = JSON.stringify(userToPost.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}