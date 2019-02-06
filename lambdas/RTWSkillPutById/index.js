// {
//   "pathParameters": {
//     "id": "8c57c8d0-8e19-11e8-924a-a70245d1837e"
//   }
// }
//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
  region: 'us-west-2', 
  apiVerson: '2012-08-10'
})

exports.SkillPutById = (event, context, callback) => {

}