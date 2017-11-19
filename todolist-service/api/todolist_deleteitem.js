'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.delete = (event, context, callback) => {
    var params = {
        TableName: process.env.TODOLIST_TABLE,
        Key: {
      id: event.pathParameters.id,
    },
    };

    console.log("Deleting TODOLIST item.");
    dynamoDb.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        callback(new Error('Couldn\'t delete item.'));
        return;
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        const response = {
        statusCode: 200,
        body: JSON.stringify("Item deleted successfully", data),
      };
      callback(null, response);

    }
});

};