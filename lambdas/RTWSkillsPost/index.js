//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.SkillsPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postProfileSkills: ', event);
  console.log('event.body @ postProfileSkills: ', event.body)
  console.log('context @ postProfileSkills: ', context);

  const params = {
    Item: body,
    TableName: process.env.TABLE
  }
  console.log('params @ postProfileSkills: ', params)
  dynamodb.putItem(params, function(err, profileSkillToPost){    
    let response = {};
    if(err){
      response.statusCode = 502;
      response.body = JSON.stringify({
        message: 'There was an error calling Dynamo DB',
        error: err
      })
      response.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      callback(response)
    } else {
      console.log('profileSkillToPost', profileSkillToPost)
      response.statusCode = 200;
      response.body = JSON.stringify(profileSkillToPost);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}