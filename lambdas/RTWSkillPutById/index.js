// {
//   "pathParameters": {
//     "id": "8c57c8d0-8e19-11e8-924a-a70245d1837e"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.SkillPutById = (event, context, callback) => {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postSkills: ', event);
  console.log('event.body @ postSkills: ', event.body)
  console.log('body @ postSkills: ', body);
  console.log('context @ postSkills: ', context);
  
  const params = {
    Key: {
      'id': body.id
    },
    ReturnValues: 'ALL_NEW',
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }
  
  console.log('params @ putSkills: ', params);
  
  dynamodb.update(params, function(err, skillToEdit){
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
      callback(err);
    } else {
      let response = {};
      console.log('skillToEdit: ', skillToEdit);
      // build response
      response.statusCode = 200;
      response.body = JSON.stringify(skillToEdit.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}

// const AWS = require('aws-sdk');
// const dynamodb = new AWS.DynamoDB({
//   region: 'us-west-2', 
//   apiVerson: '2012-08-10'
// })

// exports.SkillPutById = (event, context, callback) => {

// }