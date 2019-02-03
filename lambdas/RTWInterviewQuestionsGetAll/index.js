//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.InterviewQuestionsGetAll = (event, context, callback) => {
  // TODO implement
  let response = {}
  const params = {
    // Key: {
      // userId: event.requestContext.authorizer.claims.sub
    // },
    TableName: process.env.TABLE
  }
  // now make the dynamo scan
  dynamodb.scan(params, function(err, allInterviewQuestions){
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
      // good data
      const allInterviewQuestionsUnmarshalled = allInterviewQuestions.Items.map((iqEntry) => AWS.DynamoDB.Converter.unmarshall(iqEntry)
      )
      // shape response object
      response.statusCode = 200;
      response.body = JSON.stringify(allInterviewQuestionsUnmarshalled);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
};

// const aws = require('aws-sdk');
// const dynamodb = new aws.DynamoDB.DocumentClient();

// exports.InterviewQuestionsGetAll = (event, context, callback) => {

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
