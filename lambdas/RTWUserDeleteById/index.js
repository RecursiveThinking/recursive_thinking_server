// {
//   "pathParameters": {
//     "userId": "9cdd7120-8ed0-11e8-b260-d5e4455e16bd"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.UserDeleteById = (event, context, callback) => {
  // TODO implement
  console.log('event', event)
  console.log('context', context)

  const params = {
    Key: {
      'userId': {
        // S: event.id
        S: event.pathParameters.id
      }
      
    },
    TableName: process.env.TABLE
    // TableName: 'RecursiveThinkingDeveloperProfiles'
  }
  dynamodb.deleteItem(params, function(err, userDel){
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
      //unmarshall data
      const userDelUnmarshalled = AWS.DynamoDB.Converter.unmarshall(userDel.Item)
      console.log('user @ delete', userDelUnmarshalled)
      // build response object
      response.statusCode = 200;
      response.body = JSON.stringify(userDelUnmarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // callback response
      callback(null, response)
    }
  })
}

// exports.UserDeleteById = (event, context, callback) => {
//   // TODO implement
//   console.log('event', event)
//   console.log('context', context)

//   let response = {}
//   const params = {
//     Key: {
//       'userId': {
//         S: event.id
//       }
      
//     },
//     TableName: process.env.TABLE
//     // TableName: 'RecursiveThinkingDeveloperProfiles'
//   }
//   console.log('event', event)
//   dynamodb.deleteItem(params, function(err, data){
//     if(err){
//       console.log(err)
//       callback(err)
//     } else {
//       //unmarshall data
//       const user = AWS.DynamoDB.Converter.unmarshall(data.Item)
//       // build response object
//       response = {
//           statusCode: 200,
//           body: user
//       }
//       // callback response
//       callback(null, response)
//     }
//   })