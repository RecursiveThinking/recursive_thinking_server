// {
//   "body":

//     {
//     "Key":{"Id":"45e03470-3420-11e9-a761-959d8d1653b8"},
//     "ExpressionAttributeNames":{"#title":"title","#description":"description","#categories":"categories","#answersToQuestion":"answersToQuestion","#_createdByUser":"_createdByUser","#createdAt":"createdAt","#updatedAt":"updatedAt"},
//     "ExpressionAttributeValues":{":title":"zxcvxcv",":description":"zxcvzxcvzxcvzxcv",":categories":[],":answersToQuestion":[],":_createdByUser":"9cdd7123-8ed0-11e8-b260-d5e4455e16bd",":createdAt":"Tue Feb 19 2019 00:28:02 GMT-0800 (Pacific Standard Time)",":updatedAt":"Tue Feb 19 2019 00:28:02 GMT-0800 (Pacific Standard Time)"},
//     "UpdateExpression":"SET #title = :title, #description = :description, #categories = :categories, #answersToQuestion = :answersToQuestion, #_createdByUser = :_createdByUser, #createdAt = :createdAt, #updatedAt = :updatedAt"
        
//     }

// }
// access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.InterviewQuestionsPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postIntQuest: ', event);
  console.log('event.body @ postIntQuest: ', event.body)
  console.log('body @ postIntQuest: ', body);
  console.log('context @ postIntQuest: ', context);

  const params = {
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }
  
  console.log('params @ postIntQuest: ', params)
  
  dynamodb.update(params, function(err, intQuestToPost){    
    if(err){
      let error = {};
      error.statusCode = 502;
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
      console.log('intQuestToPost', intQuestToPost)
      response.statusCode = 200;
      response.body = JSON.stringify(intQuestToPost.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}