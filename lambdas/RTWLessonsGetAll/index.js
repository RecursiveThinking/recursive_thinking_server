//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.LessonsGetAll = (event, context, callback) => {
  // TODO implement
  const params = {
    // Key: {
      // userId: event.requestContext.authorizer.claims.sub
    // },
    TableName: process.env.TABLE
  }
  
  dynamodb.scan(params, function(err, allLessons){
    if(err){
      let error = {};
      error.statusCode = 501;
      error.body = JSON.stringify({
        message: 'There was an Error calling Dynamo DB',
        error: err
      })
      error.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      callback(err)
    } else {
      // good data
      let response = {};
      const allLessonsUnmarshalled = allLessons.Items.map(lessonEntry => AWS.DynamoDB.Converter.unmarshall(lessonEntry))
      // shape response object
      response.statusCode = 200;
      response.body = JSON.stringify(allLessonsUnmarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // invoke
      callback(null, response)
    }
  })
};

// exports.LessonsGetAll = (event, context, callback) => {
//   // TODO implement
//   let response = {};
//   const params = {
//     TableName: process.env.TABLE
//     // TableName: 'RecursiveThinkingLessons'
//   }
//   dynamodb.scan(params, function(err, allLessons){
//     if(err){
//       console.log(err)
//       callback(err)
//     } else {
//       response = {
//         status: {
//           statusCode: 200,
//         },
//         body: allLessons
//       }
//       const allLessonsUnmarshalled = response.body.Items.map((lessonEntry) => {
//         return AWS.DynamoDB.Converter.unmarshall(lessonEntry)
//       })
//       // set unmarshalled array back to response body
//       response['body'] = allLessonsUnmarshalled
//       console.log('log check - lessons', response)
//       callback(null, response)
//     }
//   })
// };

// exports.LessonsGetAll = (event, context, callback) => {

//     const params = {
//         Key: {
//             userId: event.requestContext.authorizer.claims.sub
//         },
//         TableName : process.env.TABLE
//     };

//     dynamodb.get(params, function(err, data) {
//         if (err) {
//             context.succeed({
//                 statusCode: 501,
//                 body: JSON.stringify({ message: 'There was an error when calling DynamoDB' }),
//                 headers: {'Content-Type': 'text/plain',
//                 'Access-Control-Allow-Origin': '*'}
//             });
//         } else {
//             context.succeed({
//                 statusCode: 200,
//                 body: JSON.stringify(data),
//                 headers: {'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*'}
//             });
//         }
//     });

// };
