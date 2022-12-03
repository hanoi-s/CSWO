const mongoose = require('mongoose');
const Feedback = require('./feedbackModel').schema;

const requesterSchema = new mongoose.Schema({
    FirstName: {type: String, required: true, index: true},
    LastName: {type: String, required: true, index: true},
    Email: {type: String, required: true, index: true},
    Department: {type: String, required: true, index: true},
    Feedback: Feedback
})

module.exports = mongoose.connection.model('Requester', requesterSchema);