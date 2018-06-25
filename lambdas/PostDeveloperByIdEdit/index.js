const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient();

exports.PostDeveloperByIdEdit = (event, context, callback) => {

    // console.log(JSON.stringify(event));
    const pathParam = event.pathParameters.id;
    const userid = event.requestContext.authorizer.claims.sub;

    if (pathParam !== userid) {
        return context.succeed({
            statusCode: 403,
            body: JSON.stringify({
                message: 'Forbidden.'
            }),
            headers: {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
    let body = JSON.parse(event.body);
    // console.log('body: ',body);

    // Still need to add resume, rank, skillsProfessional, skillsSoftware, skillsLanguages, lessonsAttending

    let Item = {};
    let keys = Object.keys(body);

    keys.reduce((Item, key) => {
        if (body[key] && typeof body[key] === "string" && body[key].length > 0) {
            Item[key] = body[key];
        }
        return Item;
    }, Item);
    // console.log(Item);
    Item["username"] = event.requestContext.authorizer.claims["cognito:username"];
    Item["email"] = event.requestContext.authorizer.claims.email;
    Item["userId"] = event.requestContext.authorizer.claims.sub;

    const params = {
        Item,
        TableName: process.env.TABLE
    };

    dynamodb.put(params, function (err, data) {
        if (err) {
            console.log(err);
            return context.succeed({
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
            console.log(data);
            dynamodb.get({
                    Key: {
                        userId: event.requestContext.authorizer.claims.sub
                    },
                    TableName: process.env.TABLE
                },
                function (err, data) {
                    if (err) {
                        console.log(err);
                        return context.succeed({
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
                        return context.succeed({
                            statusCode: 200,
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            }
                        });
                    }
                }
            )
        }
    });

};