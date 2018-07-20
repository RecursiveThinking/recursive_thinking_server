const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient();

exports.PostDeveloperByIdEdit = (event, context, callback) => {
    const pathParam = event.pathParameters.id;
    const userid = event.requestContext.authorizer.claims.sub;

    // Checking to see if the userId supplied by cognito(our authorizer), is the same as the pathparameter - if not we have an unauthorized user attempting to make changes to another user's profile (most likely scenario)
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
    console.log('body: ', body);

    const attributeSchema = ["picture", "city", "state", "title", "employer", "github", "codepen", "linkedin", "website", "resume", "bio", "experience", "timeWithRT", "rank"];

    // Run through all the incoming attributes and create the ExpressionAttributeValues required for updating dynamoDB - Each attribute specified in the params.UpdateExpression (picture, city, state etc) requires an ExpressionAttributeValue - in this case we are stating the updated attribute values to be whatever was supplied by the body of the POST (updated values from the client), or a default value if not supplied.
    
    function buildExpressionAttributeValues() {
        let incomingAttributes = attributeSchema.reduce((expressionAttributeValues, attribute) => {
            expressionAttributeValues[`:${attribute}`] = body[attribute] && body[attribute] != '' ? body[attribute] : " ";
            return expressionAttributeValues;
        }, {});

        if (body["skillsSoftware"]) {
            incomingAttributes[":skillsSoftware"] = body["skillsSoftware"];
        }
        if (body["skillsProfessional"]) {
            incomingAttributes[":skillsProfessional"] = body["skillsProfessional"];
        }
        if (body["skillsLanguages"]) {
            incomingAttributes[":skillsLanguages"] = body["skillsLanguages"];
        }
        incomingAttributes[":updated"] = new Date().toString();
        console.log(incomingAttributes);
        return incomingAttributes;
    }

    let ExpressionAttributeValues = buildExpressionAttributeValues();
    const params = {
        TableName: process.env.TABLE,
        Key: {
            userId: userid
        },
        UpdateExpression: "SET updated =:updated, picture =:picture, city =:city, #state =:state, title =:title, employer =:employer, github =:github, codepen =:codepen, linkedin =:linkedin, website=:website, resume =:resume, bio =:bio, experience =:experience, timeWithRT =:timeWithRT, #rank =:rank, skillsProfessional =:skillsProfessional, skillsSoftware =:skillsSoftware, skillsLanguages =:skillsLanguages",
        ExpressionAttributeNames: {
            "#state": "state",
            "#rank": "rank"
        },
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    }

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
};

// Example of ExpressionAttributeValues as written out like an object 
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