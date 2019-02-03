//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-west-2', apiVerson: '2012-08-10'})

exports.UserDeleteById = (event, context, callback) => {
  // TODO implement
  console.log('event', event)
  console.log('context', context)

  let response = {}
  const params = {
    Key: {
      'userId': {
        S: event.id
      }
      
    },
    TableName: process.env.TABLE
    // TableName: 'RecursiveThinkingDeveloperProfiles'
  }
  console.log('event', event)
  dynamodb.deleteItem(params, function(err, data){
    if(err){
      console.log(err)
      callback(err)
    } else {
      //unmarshall data
      const user = AWS.DynamoDB.Converter.unmarshall(data.Item)
      // build response object
      response = {
          statusCode: 200,
          body: user
      }
      // callback response
      callback(null, response)
    }
  })
}