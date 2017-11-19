'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.list = (event, context, callback) => {
    var params = {
        TableName: process.env.TODOLIST_TABLE,
        ProjectionExpression: "id, todolistitemname, submittedAt, updatedAt"
    };

    console.log("Scanning TODOLIST table.");
    const onScan = (err, data) => {

        if (err) {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    todoLists: data.Items
                })
            });
        }

    };

    dynamoDb.scan(params, onScan);

};


module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.TODOLIST_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch item.'));
      return;
    });
};