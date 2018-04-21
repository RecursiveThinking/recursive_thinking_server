const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient();

exports.PostLessonById = (event, context, callback) => {

    console.log(JSON.stringify(event));

    const pathParam = event.pathParameters.id;
    const userName = event.requestContext.authorizer.claims["cognito:username"];

    if (pathParam !== userName) {
        return context.succeed({
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden.' }),
            headers: {'Content-Type': 'text/plain'}
        });
    }

    const params = {
        Item: {
            ...JSON.parse(event.body),
            Username: event.requestContext.authorizer.claims["cognito:username"]
        },
        TableName : process.env.TABLE
    };

    dynamodb.put(params, function(err, data) {
        if (err) {
            return context.succeed({
                statusCode: 501,
                body: JSON.stringify({ message: 'There was an error when calling DynamoDB' }),
                headers: {'Content-Type': 'text/plain'}
            });
        } else {
            return context.succeed({
                statusCode: 200,
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            });
        }
    });

};
