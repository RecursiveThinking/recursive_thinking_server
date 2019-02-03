//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({region: 'us-west-2', apiVerson: '2012-08-10'})

exports.HomeScreenQuotesGetAll = (event, context, callback) => {
  // TODO implement
  let response = {}
  const params = {
    // Key: {
      // userId: event.requestContext.authorizer.claims.sub
    // },
    TableName: process.env.TABLE
  }
  // now make the dynamo scan
  dynamodb.scan(params, function(err, allHomeScreenQuotes){
    if(err){
      response.statusCode = 501;
      response.body = JSON.stringify({
        message: 'There was an Error calling Dynamo DB',
        error: err
      })
      response.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      callback(response)
    } else {
      // convert database arr/obj to json obj
      const allHomeScreenQuotesUnMarshalled = allHomeScreenQuotes.Items.map((hsqEntry) => AWS.DynamoDB.Converter.unmarshall(hsqEntry))
      // shape response object
      response.statusCode = 200;
      response.body = JSON.stringify(allHomeScreenQuotesUnMarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // invoke
      callback(null, response)
    }
  })
};

// const aws = require('aws-sdk');
// const dynamodb = new aws.DynamoDB.DocumentClient();

// exports.InterviewQuestionsAnswersGetAll = (event, context, callback) => {

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
