'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.addnew = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const todolistitemname = requestBody.todolistitemname;

  if (typeof todolistitemname !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t add item because of validation errors.'));
    return;
  }

  submitItemP(itemInfo(todolistitemname))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully added new item ${todolistitemname}`,
          itemId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to add new item ${todolistitemname}`
        })
      })
    });
};


const submitItemP = item => {
  console.log('Submitting item');
  const itemInfo = {
    TableName: process.env.TODOLIST_TABLE,
    Item: item,
  };
  return dynamoDb.put(itemInfo).promise()
    .then(res => item);
};

const itemInfo = (todolistitemname) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    todolistitemname: todolistitemname,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};