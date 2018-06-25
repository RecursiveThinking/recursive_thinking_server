const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient();

exports.PostLessonById = (event, context, callback) => {

    console.log(JSON.stringify(event));

    // const pathParam = event.pathParameters.id;
    // const createdBy = event.requestContext.authorizer.claims.sub;

    const params = {
        Item: {
            ...JSON.parse(event.body),
            createdBy: event.requestContext.authorizer.claims.sub
        },
        TableName: process.env.TABLE
    };

    dynamodb.put(params, function (err, data) {
        if (err) {
            console.log(err);
            return context.succeed({
                statusCode: 501,
                body: JSON.stringify({
                    message: 'There was an error when calling DynamoDB'
                }),
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } else {
            return context.succeed({
                statusCode: 200,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    });

};