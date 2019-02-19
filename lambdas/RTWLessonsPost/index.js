// access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.LessonsPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postLessons: ', event);
  console.log('event.body @ postLessons: ', event.body)
  console.log('body @ postLessons: ', body);
  console.log('context @ postLessons: ', context);

  const params = {
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }

  console.log('params @ postLessons: ', params)
  
  dynamodb.update(params, function(err, lessonToPost){    
    if(err){
      let error = {};
      error.statusCode = 501;
      error.body = JSON.stringify({
        message: 'There was an error calling Dynamo DB',
        error: err
      })
      error.headers = {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
      // callback(error)
      callback(err)
    } else {
      let response = {};
      console.log('lessonToPost', lessonToPost);
      // build response
      response.statusCode = 200;
      response.body = JSON.stringify(lessonToPost.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}

// {"Key":{"Id":"ac8318f0-327a-11e9-ac52-17a2e98c2a03"},"ExpressionAttributeNames":{"#title":"title","#date":"date","#description":"description","#lessonTaughtBy":"lessonTaughtBy","#lessonAttendees":"lessonAttendees","#lessonVotes":"lessonVotes","#scheduled":"scheduled","#_lessonCreatedBy":"_lessonCreatedBy","#createdAt":"createdAt","#updatedAt":"updatedAt"},"ExpressionAttributeValues":{":title":"cvbxcv",":date":" ",":description":"xcvb",":lessonTaughtBy":[],":lessonAttendees":[],":lessonVotes":[],":scheduled":false,":_lessonCreatedBy":"9cdd7123-8ed0-11e8-b260-d5e4455e16bd",":createdAt":"Sat Feb 16 2019 22:17:16 GMT-0800 (Pacific Standard Time)",":updatedAt":"Sat Feb 16 2019 22:17:16 GMT-0800 (Pacific Standard Time)"},"UpdateExpression":"SET #title = :title, #date = :date, #description = :description, #lessonTaughtBy = :lessonTaughtBy, #lessonAttendees = :lessonAttendees, #lessonVotes = :lessonVotes, #scheduled = :scheduled, #_lessonCreatedBy = :_lessonCreatedBy, #createdAt = :createdAt, #updatedAt = :updatedAt"}

// {
//   "headers": {
//     "Authorization": "eyJraWQiOiIwRjNZMlFiNENBQk5cL1A5ZGRqODhYa0RocDUzekI4d0s2VjFmbllJOVRoQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NmYyM2I0ZC0xMjI3LTQ4MjgtYTVjOC1hMmQ0YWQ0ZDM3YjgiLCJhdWQiOiI0NGk2cG8yYTM5bGMzcXN1djVzazlndnNvdCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImJlYWRkZGJjLTMyMTgtMTFlOS1iMTczLTVmODA2YmM5OTczNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUwMzQxNzQ3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9qVkk5UlEycFEiLCJuYW1lIjoiU2V0aCBCb3JuZSIsImNvZ25pdG86dXNlcm5hbWUiOiJzZXRoYm9ybmUiLCJleHAiOjE1NTAzNTMxMDcsImlhdCI6MTU1MDM0OTUwNywiZW1haWwiOiJzZXRoYm9ybmVAZ21haWwuY29tIn0.LykFiSl3AbMJ6yaCuPgyVex3iFfeYDIlngFm_5P7Ai9I59Oj7EeOF-a9QQwR0uaYZm4Lr_xSgLMsPEiaT7q2B-dATbnPeNHSN_KPdB7NOUXwJwTQZRk07h7uvLIYymZWWOe0xilJRX0RfXBs-wEYaEybWClqvX_R_3ZK3_Ud1dx8hSvqFPFOaT06P_Z2m3wISLmx9NHz_vXtrPcIxvfOMQ0FBks0pyzou9uhT7NIIT0y_QdzmbedW7NF3HrZRirP3OlJ6-SHdU03CFnrG-HEvvtvo_SdS6jStoXI5It0tz73fuStGTVo6v-QuB5VcCPazdIvYHoOwhu8U_DpaQHzHQ",
//     "Content-Type": "application/json"
//   }
//   "method": "POST"
  // "body": {
  //   "Id": "2f71ed30-2987-11e9-9371-4529063761d1",
  //   "title": "asdfasdfasdf",
  //   "date": " ",
  //   "description": "asdfsadfsd",
  //   "lessonTaughtBy": [],
  //   "lessonAttendees": [],
  //   "lessonVotes": [],
  //   "scheduled": false,
  //   "_lessonCreatedBy": " ",
  //   "createdAt": "2019-02-05T20:47:00.483Z",
  //   "updatedAt": "2019-02-05T20:47:00.483Z"
  // }
// }

// Authorization:eyJraWQiOiIwRjNZMlFiNENBQk5cL1A5ZGRqODhYa0RocDUzekI4d0s2VjFmbllJOVRoQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NmYyM2I0ZC0xMjI3LTQ4MjgtYTVjOC1hMmQ0YWQ0ZDM3YjgiLCJhdWQiOiI0NGk2cG8yYTM5bGMzcXN1djVzazlndnNvdCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImJlYWRkZGJjLTMyMTgtMTFlOS1iMTczLTVmODA2YmM5OTczNiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTUwMzQxNzQ3LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9qVkk5UlEycFEiLCJuYW1lIjoiU2V0aCBCb3JuZSIsImNvZ25pdG86dXNlcm5hbWUiOiJzZXRoYm9ybmUiLCJleHAiOjE1NTAzNTMxMDcsImlhdCI6MTU1MDM0OTUwNywiZW1haWwiOiJzZXRoYm9ybmVAZ21haWwuY29tIn0.LykFiSl3AbMJ6yaCuPgyVex3iFfeYDIlngFm_5P7Ai9I59Oj7EeOF-a9QQwR0uaYZm4Lr_xSgLMsPEiaT7q2B-dATbnPeNHSN_KPdB7NOUXwJwTQZRk07h7uvLIYymZWWOe0xilJRX0RfXBs-wEYaEybWClqvX_R_3ZK3_Ud1dx8hSvqFPFOaT06P_Z2m3wISLmx9NHz_vXtrPcIxvfOMQ0FBks0pyzou9uhT7NIIT0y_QdzmbedW7NF3HrZRirP3OlJ6-SHdU03CFnrG-HEvvtvo_SdS6jStoXI5It0tz73fuStGTVo6v-QuB5VcCPazdIvYHoOwhu8U_DpaQHzHQ
// Content-Type: application/json


//access SDK
// const AWS = require('aws-sdk');
// // const dynamodb = new AWS.DynamoDB.DocumentClient();
// const dynamodb = new AWS.DynamoDB({
//   region: 'us-west-2', 
//   apiVerson: '2012-08-10'
// })

// exports.LessonsPost = (event, context, callback) => {
//   // const userId = event.requestContext.authorizor.claims.sub;
//   const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
//   console.log('event @ postLessons: ', event);
//   console.log('event.body @ pl: ', event.body)
//   console.log('body @ pl: ', body);
//   console.log('context @ postLessons: ', context);

//   const params = {
//     Key: {
//       "Id": {
//         S: `${body.Key.Id}`
//       }
//     },
//     ReturnValues: "ALL_NEW",
//     TableName: process.env.TABLE
//   }
//   for(let key in body){
//     // params[key] = body[key]
//     if(key === 'UpdateExpression'){
//       params[key] = body[key];
//     } 
//     else if(key === 'ExpressionAttributeNames'){
//       params[key] = body[key];
//     }
//     else if(key === 'Key'){
//       // do nothing
//     }
//     else {
//       params[key] = AWS.DynamoDB.Converter.marshall(body[key])
//     }
//   }

//   console.log('params @ lessonPost: ', params)
  
//   dynamodb.updateItem(params, function(err, lessonToPost){    
//     if(err){
//       let error = {};
//       error.statusCode = 501;
//       error.body = JSON.stringify({
//         message: 'There was an error calling Dynamo DB',
//         error: err
//       })
//       error.headers = {
//         'Content-Type': 'text/plain',
//         'Access-Control-Allow-Origin': '*'
//       }
//       // callback(error)
//       callback(err)
//     } else {
//       let response = {};
//       console.log('lessonToPost', lessonToPost);
//       // build response
//       response.statusCode = 200;
//       response.body = JSON.stringify(lessonToPost);
//       response.headers = {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       }
//       callback(null, response)
//     }
//   })
// }