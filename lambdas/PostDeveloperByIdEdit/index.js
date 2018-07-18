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

    let incomingAttributes = {};
    let keys = Object.keys(body);

    keys.reduce((incomingAttributes, key) => {
        if (body[key] && typeof body[key] === "string" && body[key].length > 0) {
            incomingAttributes[key] = body[key];
        }
        return incomingAttributes;
    }, incomingAttributes);
    console.log(incomingAttributes);
    incomingAttributes["username"] = event.requestContext.authorizer.claims["cognito:username"];
    incomingAttributes["email"] = event.requestContext.authorizer.claims.email;
    incomingAttributes["userId"] = event.requestContext.authorizer.claims.sub;

    const attributeSchema = ["picture", "city", "state", "title", "employer", "github", "codepen", "linkedin", "website", "resume", "bio", "experience", "timeWithRT", "rank"];

    let ExpressionAttributeValues = buildExpressionAttributeValues();
    ExpressionAttributeValues[":updated"] = new Date().toString();

    const params = {
        TableName: process.env.TABLE,
        Key: {
            userId: incomingAttributes["userId"]
        },
        UpdateExpression: "SET updated =:updated, picture =:picture, city =:city, #state =:state, title =:title, employer =:employer, github =:github, codepen =:codepen, linkedin =:linkedin, website=:website, resume =:resume, bio =:bio, experience =:experience, timeWithRT =:timeWithRT, #rank =:rank",
        ExpressionAttributeNames: {
            "#state": "state",
            "#rank" : "rank"
        },
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    }

    function buildExpressionAttributeValues() {
        return attributeSchema.reduce((expressionAttributeValues, attribute) => {
            expressionAttributeValues[`:${attribute}`] = incomingAttributes[attribute] && incomingAttributes[attribute] != '' ? incomingAttributes[attribute] : null;

            return expressionAttributeValues;
        }, {});
    }

    // ExpressionAttributeValues: {
    //     ":updated": new Date().toString(),
    //     ":picture": incomingAttributes[":picture"] != '' ? incomingAttributes[picture] : null,
    //     ":city": incomingAttributes[":city"] != '' ? incomingAttributes[city] : null,
    //     ":state": incomingAttributes[":state"] != '' ? incomingAttributes[state] : null,
    //     ":title": incomingAttributes[":title"] != '' ? incomingAttributes[title] : null,
    //     ":employer": incomingAttributes[":employer"] != '' ? incomingAttributes[employer] : null,
    //     ":github": incomingAttributes[":github"] != '' ? incomingAttributes[github] : null,
    //     ":codepen": incomingAttributes[":codepen"] != '' ? incomingAttributes[codepen] : null,
    //     ":linkedin": incomingAttributes[":linkedin"] != '' ? incomingAttributes[linkedin] : null,
    //     ":website": incomingAttributes[":website"] != '' ? incomingAttributes[website] : null,
    //     ":resume": incomingAttributes[":resume"] != '' ? incomingAttributes[resume] : null,
    //     ":bio": incomingAttributes[":bio"] != '' ? incomingAttributes[bio] : null,
    //     ":experience": incomingAttributes[":experience"] != '' ? incomingAttributes[experience] : null,
    //     ":timeWIthRT": incomingAttributes[":timeWIthRT"] != '' ? incomingAttributes[timeWIthRT] : null,
    //     ":rank": incomingAttributes[":rank"] != '' ? incomingAttributes[rank] : null
    // }


    dynamodb.update(params, function (err, data) {
        if (err) {
            console.log(err);
            return context.succeed({
                statusCode: 501,
                body: JSON.stringify({
                    message: 'There was an error when calling DynamoDB to update the User',
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
                                message: 'There was an error when calling DynamoDB to retrieve the updated User',
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
    })



    // const params = {
    //     incomingAttributes,
    //     TableName: process.env.TABLE
    // };

    /*

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
    */

};