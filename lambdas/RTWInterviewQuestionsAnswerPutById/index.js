// {
//   "pathParameters": {
//     "id": "fecc0b10-8f54-11e8-a926-e1e118251c18"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.InterviewQuestionAnswerPutById = (event, context, callback) => {
  console.log('event @ IntQuestAnsById Put', event);
  console.log('context @ IntQuestAnsById Put', context);

}