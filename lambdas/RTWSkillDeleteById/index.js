// {
//   "pathParameters": {
//     "id": "8c57c8d0-8e19-11e8-924a-a70245d1837e"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-west-2', apiVerson: '2012-08-10'})

exports.SkillDeleteById = (event, context, callback) => {
  console.log('event @ SkillDeleteById', event);
  console.log('context @ SkillDeleteById', context);
  
  const params = {
    Key: {
      'Id': {
        // S: event.id
        S: event.pathParameters.id
      }
    },
    TableName: process.env.TABLE
  }
  dynamodb.deleteItem(params, function(err, skillDel){
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
      console.log('err', response);
      callback(response)
    } else {
      // lessonDel
      const skillDelUnmarshalled = AWS.DynamoDB.Converter.unmarshall(skillDel.Item)
      console.log('lesson @ delete', skillDelUnmarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}