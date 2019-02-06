// {
//   "pathParameters": {
//     "id": "8c57c8d0-8e19-11e8-924a-a70245d1837e"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.SkillGetById = (event, context, callback) => {
  console.log('event @ SkillGetById', event);
  console.log('context @ SkillGetById', context);
  const params = {
    Key: {
      'Id': {
        // S: event.id
        S: event.pathParameters.id
      }
    },
    TableName: process.env.TABLE
  }
  dynamodb.getItem(params, function(err, skill){
    let response = {};
    if(err){
      response.statusCode = 501;
      response.body = JSON.stringify({
        message: 'There was an error calling DynamoDB',
        error: err
      })
      response.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      console.log('err @ LessonGetById', response.error)
      callback(response)
    } else {
      // good skill so get it and unmarshall
      const skillByIdUnmarshalled = AWS.DynamoDB.Converter.unmarshall(skill.Item)
      // build repsonse
      response.statusCode = 200;
      response.body = JSON.stringify(skillByIdUnmarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}