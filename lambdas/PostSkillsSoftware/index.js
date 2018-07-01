const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient();

exports.PostSkillsSoftware = (event, context, callback) => {

    const params = {
        TableName: process.env.TABLE
    };

    dynamodb.scan(params, function (err, data) {
        if (err) {
            context.succeed({
                statusCode: 501,
                body: JSON.stringify({
                    message: 'There was an error when calling DynamoDB',
                    error: err
                }),
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } else {
            context.succeed({
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