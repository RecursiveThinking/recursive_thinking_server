// {
//   "pathParameters": {
//     "id": "8c57c8d0-8e19-11e8-924a-a70245d1837e"
//   }
// }
// access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.LessonDeleteById = (event, context, callback) => {
  console.log('event @ LessonDeleteId Delete: ', event);
  console.log('context @ LessonDeleteId Delete: ', context);
  console.log('callback @ LessonDeleteId Delete: ', callback);
  
  const params = {
    Key: {
      'Id': event.pathParameters.id
    },
    ReturnValues: "ALL_OLD",
    TableName: process.env.TABLE
  }
  dynamodb.delete(params, function(err, lessonDel){
    if(err){
      let error = {}
      error.statusCode = 501;
      error.body = JSON.stringify({
        message: 'There was an error calling DynamoDB',
        error: err
      })
      error.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      console.log('err', err);
      console.log('error', error)
      callback(err)
    } else {
      let response = {};
      console.log('Item Deleted Successfully')
      // build response object
      response.statusCode = 200;
      response.body = JSON.stringify(lessonDel.Attributes)
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}