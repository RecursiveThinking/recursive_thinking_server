
// access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.LessonPutById = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postLessons: ', event);
  console.log('event.body @ postLessons: ', event.body)
  console.log('body @ postLessons: ', body);
  console.log('context @ postLessons: ', context);

  const params = {
    Key: {
      // 'Id': event.pathParameters.id
      'Id': body.Id
    },
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }

  console.log('params @ postLessons: ', params)
  
  dynamodb.update(params, function(err, lessonToEdit){    
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
      console.log('lessonToEdit', lessonToEdit);
      // build response
      response.statusCode = 200;
      response.body = JSON.stringify(lessonToEdit.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}