const { request, response, logger } = require('@cot/lambda-helpers')
const AWS = require('aws-sdk')

module.exports.handler = async event => {
  const log = logger()
  try{
    const item = {
        ...JSON.parse(event.body),
      }

    log.progress('Scanning items from Dynamo')
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const dynamoParams = {
        TableName: process.env.CONTACTS_TABLE_NAME,
        Item: item
      }
    await dynamodb.scan(dynamoParams).promise()
    return response.success({
        id:contactId
      })
  } catch(error) {
    log.error('something went wrong in `getContacts`, message: ', error)
    return response.error('Something went wrong')
  }
}
