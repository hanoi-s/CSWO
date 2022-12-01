const mongoose = require('mongoose');
const Feedback = require('./feedbackModel').schema;

const requesterSchema = new mongoose.Schema({
    FirstName: {type: String, required: true},
    LastName: {type: String, required: true},
    Email: {type: String, required: true},
    Department: {type: String, required: true},
    Feedback: Feedback
})

module.exports = mongoose.connection.model('Requester', requesterSchema);