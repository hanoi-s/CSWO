const mongoose = require('mongoose');
const RequestModel = require('../models/requestModel.js');
const RequesterModel = require('../models/requesterModel.js');


// Connect to the database
const url = "mongodb+srv://cswo:cswopassword@cswo.3czmrw0.mongodb.net/CSWO?retryWrites=true&w=majority";

const database = {
    connect: function () {
        mongoose.connect(url, function(error) {
            if(error)
                throw error;
            else
                // console.log("Connected to: " + url);
                console.log("Connected to the database");
        });
    },

    findRequests: function(model, query, projection, callback) {
        RequestModel.find(query, projection, function(error, result) {
            if(error) return callback(false);
            return callback(result);
        }).sort({ DateReceived: 'desc' });
    },

    findMany: function(model, query, projection, callback) {
        model.find(query, projection, function(error, result) {
            if(error) return callback(false);
            return callback(result);
        });
    },

    findOne: function(model, query, projection, callback) {
        model.find(query, projection, function(error, result) {
            if(error) return callback(false);
            return callback(result);
        });
    },
}

// Export this file for other files to find
module.exports = database;