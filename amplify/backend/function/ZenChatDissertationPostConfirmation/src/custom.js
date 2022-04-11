/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const aws = require('aws-sdk');
const ddbClient = new aws.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event) => {
  // insert code to be executed by your lambda trigger

  // save user in database (DynamoDB)
  if (!event?.request?.userAttributes?.sub) {
    console.log("No such sub");
    return;
  }

  const now = new Date();
  const timeStamp = now.getTime(); 

  const uItem = {
    __typename: {
      S: 'User'
    },
    _lastChangedAt: {
      N: timeStamp.toString()
    },
    _version: {
      N: "1.0"
    },
    createdAt: {
      S: now.toISOString()
    },
    updatedAt: {
      S: now.toISOString()
    },
    id: {
      S: event.request.userAttributes.sub
    },
    name: {
      S: event.request.userAttributes.email
    }
  }

  const params = {
    Item: uItem,
    TableName: tableName
  };

  try {
    await ddbClient.putItem(params).promise();
  } catch (e) {
    console.log(e)
  }
};
