//access SDK
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.UsersPost = (event, context, callback) => {
  // const userId = event.requestContext.authorizor.claims.sub;
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body
  console.log('event @ postUsers: ', event);
  console.log('event.body @ postUsers: ', event.body)
  console.log('body @ postUsers: ', body);
  console.log('context @ postUsers: ', context);

  const params = {
    ReturnValues: "ALL_NEW",
    TableName: process.env.TABLE
  }
  
  for(let key in body){
    params[key] = body[key]
  }

  console.log('params @ postUsers: ', params)
  
  dynamodb.update(params, function(err, userToPost){    
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
      console.log('userToPost', userToPost);
      // build response
      response.statusCode = 200;
      response.body = JSON.stringify(userToPost.Attributes);
      response.headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      callback(null, response)
    }
  })
}

// {
//   "body": {
//     "Key":{"userId":"b3cb6ece-b05d-4a22-b50f-1281d710e847"},
//     "ExpressionAttributeNames":{"#userId":"userId","#username":"username","#name":"name","#email":"email","#avatar":"avatar","#city":"city","#state":"state","#title":"title","#employer":"employer","#linkGithub":"linkGithub","#linkCodepen":"linkCodepen","#linkLinkedIn":"linkLinkedIn","#linkPortfolioWebsite":"linkPortfolioWebsite","#linkResume":"linkResume","#bio":"bio","#profileStatsVisits":"profileStatsVisits","#profileStatsViewsGithub":"profileStatsViewsGithub","#profileStatsViewsCodePen":"profileStatsViewsCodePen","#profileStatsViewsPortfolio":"profileStatsViewsPortfolio","#profileStatsViewsLinkedIn":"profileStatsViewsLinkedIn","#profileStatsViewsResume":"profileStatsViewsResume","#experience":"experience","#timeWithRT":"timeWithRT","#rank":"rank","#skillsProfessional":"skillsProfessional","#skillsSoftware":"skillsSoftware","#skillsLanguages":"skillsLanguages","#lessonStatus":"lessonStatus","#admin":"admin","#inactive":"inactive","#isProfileSetup":"isProfileSetup","#createdAt":"createdAt","#updatedAt":"updatedAt"},
//     "ExpressionAttributeValues":{":userId":"b3cb6ece-b05d-4a22-b50f-1281d710e847",":username":"sethborne",":name":"Seth Borne",":email":"sethborne@gmail.com",":avatar":" ",":city":" ",":state":" ",":title":" ",":employer":" ",":linkGithub":" ",":linkCodepen":" ",":linkLinkedIn":" ",":linkPortfolioWebsite":" ",":linkResume":" ",":bio":" ",":profileStatsVisits":" ",":profileStatsViewsGithub":" ",":profileStatsViewsCodePen":" ",":profileStatsViewsPortfolio":" ",":profileStatsViewsLinkedIn":" ",":profileStatsViewsResume":" ",":experience":" ",":timeWithRT":"Wed Feb 20 2019 12:34:47 GMT-0800 (Pacific Standard Time)",":rank":" ",":skillsProfessional":[],":skillsSoftware":[],":skillsLanguages":[],":lessonStatus":{},":admin":false,":inactive":false,":isProfileSetup":false,":lastLogin":"Wed Feb 20 2019 12:34:47 GMT-0800 (Pacific Standard Time)",":lastLogout":"Wed Feb 20 2019 12:34:47 GMT-0800 (Pacific Standard Time)",":createdAt":"Wed Feb 20 2019 12:34:47 GMT-0800 (Pacific Standard Time)",":updatedAt":"Wed Feb 20 2019 12:34:47 GMT-0800 (Pacific Standard Time)"},
//     "UpdateExpression":"SET #userId = :userId, #username = :username, #name = :name, #email = :email, #avatar = :avatar, #city = :city, #state = :state, #title = :title, #employer = :employer, #linkGithub = :linkGithub, #linkCodepen = :linkCodepen, #linkLinkedIn = :linkLinkedIn, #linkPortfolioWebsite = :linkPortfolioWebsite, #linkResume = :linkResume, #bio = :bio, #profileStatsVisits = :profileStatsVisits, #profileStatsViewsGithub = :profileStatsViewsGithub, #profileStatsViewsCodePen = :profileStatsViewsCodePen, #profileStatsViewsPortfolio = :profileStatsViewsPortfolio, #profileStatsViewsLinkedIn = :profileStatsViewsLinkedIn, #profileStatsViewsResume = :profileStatsViewsResume, #experience = :experience, #timeWithRT = :timeWithRT, #rank = :rank, #skillsProfessional = :skillsProfessional, #skillsSoftware = :skillsSoftware, #skillsLanguages = :skillsLanguages, #lessonStatus = :lessonStatus, #admin = :admin, #inactive = :inactive, #isProfileSetup = :isProfileSetup, #lastLogin = :undefined, #lastLogout = :undefined, #createdAt = :createdAt, #updatedAt = :updatedAt"
//   }
// }