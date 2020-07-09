const { request, response, logger } = require('@cot/lambda-helpers')
const AWS = require('aws-sdk')
const cuid = require('cuid')

module.exports.handler = async event => {
  const log = logger()
  try{
    if(!event.body) {
      return response.error('Missing event body', 400)
    }
    const {name, lastName, phoneNumber} = JSON.parse(event.body)

    if(!(name && lastName && phoneNumber)) {
      return response.error('Missing Parameters', 400)
    }
    const contactId = cuid()
    const item = {
      ...JSON.parse(event.body),
      id: contactId
    }

    log.progress('Inserting item into Dynamo')
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const dynamoParams = {
      TableName: process.env.CONTACTS_TABLE_NAME,
      Item: item
    }
    await dynamodb.put(dynamoParams).promise()

    return response.success({
      id:contactId
    })
  } catch(error) {
    log.error('something went wrong in `postContacts`, message: ', error)
    return response.error('Something went wrong')
  }
}
