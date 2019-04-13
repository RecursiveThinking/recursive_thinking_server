//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-west-2', apiVerson: '2012-08-10'})

exports.RanksGetAll = (event, context, callback) => {
  // TODO implement
  console.log('event @ getAllRanks: ', event);
  console.log('event.body @ getAllRanks: ', event.body)
  // console.log('body @ getAllRanks: ', body);
  console.log('context @ getAllRanks: ', context);
  const params = {
    // Key: {
      // userId: event.requestContext.authorizer.claims.sub
    // },
    TableName: process.env.TABLE
  }
  // now make the dynamo scan
  dynamodb.scan(params, function(err, allRanks){
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
      let response = {};
      // convert database arr/obj to json obj
      const allRanksUnMarshalled = allRanks.Items.map((rankEntry) => AWS.DynamoDB.Converter.unmarshall(rankEntry))
      console.log(allRanksUnMarshalled)
      // shape response object
      response.statusCode = 200;
      response.body = JSON.stringify(allRanksUnMarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // invoke
      callback(null, response)
    }
  })
};