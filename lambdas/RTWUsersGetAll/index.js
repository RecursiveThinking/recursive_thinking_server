//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.UsersGetAll = (event, context, callback) => {
  // TODO implement
  let response = {}
  const params = {
    // Key: {
      // userId: event.requestContext.authorizer.claims.sub
    // },
    TableName: process.env.TABLE
  }
  dynamodb.scan(params, function(err, allUsers){
    
    if(err){
      let error = {}
      error.statusCode = 501;
      error.body = JSON.stringify({
        message: 'There was an error calling Dynamo DB',
        error: err
      })
      error.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      callback(err)
    } else {
      let response = {}
      const allUsersUnmarshalled = allUsers.Items.map(userEntry => AWS.DynamoDB.Converter.unmarshall(userEntry))
      // construct response
      response.statusCode = 200;
      response.body = JSON.stringify(allUsersUnmarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // invoke callback
      callback(null, response)
    }
  })
};
  
//   dynamodb.scan(params, function (err, allUsers){
//     if(err){
//       console.log(err)
//       callback(err)
//     } else {
//       response = {
//           status: {
//             statusCode: 200
//           },
//           body: allUsers
//       }
//       // convert database info to a json obj
//       const allUsersUnmarshalled = response.body.Items.map((userEntry) => {
//           return AWS.DynamoDB.Converter.unmarshall(userEntry)
//       })
//       // put back good data in body
//       response['body'] = allUsersUnmarshalled;
//       //
//       console.log('log check - Users', response)
//       callback(null, response)
//     }
//   })
// };

// const aws = require('aws-sdk');
// const dynamodb = new aws.DynamoDB.DocumentClient();

// exports.UsersGetAll = (event, context, callback) => {

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
