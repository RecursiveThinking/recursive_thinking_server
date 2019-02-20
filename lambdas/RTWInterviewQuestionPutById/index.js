//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.InterviewQuestionPutById = (event, context, callback) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postIntQuestions: ', event);
  console.log('event.body @ postIntQuestions: ', event.body)
  console.log('body @ postIntQuestions: ', body);
  console.log('context @ postIntQuestions: ', context);

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

  console.log('params @ putIntQuestions: ', params)
  
  dynamodb.update(params, function(err, intQuestToEdit){    
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
      console.log('intQuestToEdit', intQuestToEdit);
      // build response
      response.statusCode = 200;
      response.body = JSON.stringify(intQuestToEdit.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}