// {
//   "pathParameters": {
//     "id": "fecc0b10-8f54-11e8-a926-e1e118251c18"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.InterviewQuestionAnswerPutById = (event, context, callback) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ putIntQuestAnsById: ', event);
  console.log('event.body @ putIntQuestAnsById: ', event.body)
  console.log('body @ putIntQuestAnsById: ', body);
  console.log('context @ putIntQuestAnsById: ', context);
  
  const params = {
    Key: {
      'Id': body.Id
    },
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }
  
  console.log('params @ putIntQuestionAnswers: ', params)
  
  dynamodb.update(params, function(err, intQuestAnsToEdit){
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
      console.log('err', err)
      callback(error)
    } else {
      let response = {}
      console.log('intQuestAnsToEdit: ', intQuestAnsToEdit);
      // build response
      response.statusCode = 200;
      response.body = JSON.stringify(intQuestAnsToEdit.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}