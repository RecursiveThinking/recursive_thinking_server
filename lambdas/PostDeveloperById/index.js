const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient();

exports.PostDeveloperById = (event, context, callback) => {

    console.log(JSON.stringify(event));

    const pathParam = event.pathParameters.id;
    const userId = event.requestContext.authorizer.claims.sub;


    if (pathParam !== userId) {
        return context.succeed({
            statusCode: 403,
            body: JSON.stringify({
                message: 'Forbidden.'
            }),
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin' : '*'
            }
        });
    }

    const params = {
        Item: {
            username: event.requestContext.authorizer.claims["cognito:username"],
            email: event.requestContext.authorizer.claims.email,
            name: event.requestContext.authorizer.claims.name,
            userId: event.requestContext.authorizer.claims.sub
        },
        TableName: process.env.TABLE
    };

    dynamodb.put(params, function (err, data) {
        if (err) {
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