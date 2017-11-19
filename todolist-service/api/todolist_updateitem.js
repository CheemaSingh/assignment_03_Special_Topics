'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.update = (event, context, callback) => {
   
   const requestBody = JSON.parse(event.body);
   const id = event.pathParameters.id;
   const todolistitemname = requestBody.todolistitemname;
   const timestamp = new Date().getTime();

    if (id && todolistitemname) {

  const params = {
    TableName: process.env.TODOLIST_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#todo_myitem': 'todolistitemname',
    },
    ExpressionAttributeValues: {
      ':todolistitemname': todolistitemname,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #todo_myitem = :todolistitemname, updatedAt = :updatedAt',
    ReturnValues:"ALL_NEW"
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update item.'));
      return;
    }
    else{
    const response = {
      statusCode: 200,
      body: JSON.stringify("Item updated successfully", result.Attributes),
    };
    callback(null, response);
    }
  });
  }
  else{
    console.error('Validation Failed');
    callback(new Error('Validation Failed.'));
    return;
  }
};