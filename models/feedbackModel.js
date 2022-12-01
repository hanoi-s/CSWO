const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    DateCreated: {type: String, required: true},
    ResponseTime: {type: String, required: true},
    Accuracy: {type: Number, default: 0, required: true},
    Efficiency: {type: Number, default: 0, required: true},
    Courtesy: {type: Number, default: 0, required: true},
    Remarks: {type: String, required: true}
})

module.exports = mongoose.connection.model('Feedback', feedbackSchema);