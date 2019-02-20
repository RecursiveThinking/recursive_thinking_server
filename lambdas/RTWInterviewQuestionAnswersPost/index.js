// {
//   "body": {
//     "{"Key":{"Id":"76566790-3421-11e9-abd8-4d55235f8f63"},"ExpressionAttributeNames":{"#description":"description","#_createdByUser":"_createdByUser","#upVotes":"upVotes","#downVotes":"downVotes","#createdAt":"createdAt","#updatedAt":"updatedAt"},"ExpressionAttributeValues":{":description":"this is something",":_createdByUser":"9cdd7123-8ed0-11e8-b260-d5e4455e16bd",":upVotes":[],":downVotes":[],":createdAt":"Tue Feb 19 2019 00:36:33 GMT-0800 (Pacific Standard Time)",":updatedAt":"Tue Feb 19 2019 00:36:33 GMT-0800 (Pacific Standard Time)"},"UpdateExpression":"SET #description = :description, #_createdByUser = :_createdByUser, #upVotes = :upVotes, #downVotes = :downVotes, #createdAt = :createdAt, #updatedAt = :updatedAt"}"
//   }
// }
// access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.InterviewQuestionAnswersPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postIntQuestAns: ', event);
  console.log('event.body @ postIntQuestAns: ', event.body)
  console.log('body @ postIntQuestAns: ', body)
  console.log('context @ postIntQuestAns: ', context);

  const params = {
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }
  
  console.log('params @ postIntQuestAns: ', params)
  
  dynamodb.update(params, function(err, intQuestAnsToPost){    
    
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
      console.log('intQuestAnsToPost', intQuestAnsToPost)
      response.statusCode = 200;
      response.body = JSON.stringify(intQuestAnsToPost.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}