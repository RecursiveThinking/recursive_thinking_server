//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.LessonsPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postLessons: ', event);
  console.log('event.body @ pl: ', event.body)
  console.log('context @ postLessons: ', context);

  const params = {
    Item: body,
    TableName: process.env.TABLE
  }
  console.log('params @ lessonPost: ', params)
  dynamodb.putItem(params, function(err, lessonToPost){    
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
      console.log('lessonToPost', lessonToPost)
      response.statusCode = 200;
      response.body = JSON.stringify(lessonToPost);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}

// {
//   "body": {
//     "Id": "2f71ed30-2987-11e9-9371-4529063761d1",
//     "title": "asdfasdfasdf",
//     "date": " ",
//     "description": "asdfsadfsd",
//     "lessonTaughtBy": [],
//     "lessonAttendees": [],
//     "lessonVotes": [],
//     "scheduled": false,
//     "_lessonCreatedBy": " ",
//     "createdAt": "2019-02-05T20:47:00.483Z",
//     "updatedAt": "2019-02-05T20:47:00.483Z"
//   }
// }