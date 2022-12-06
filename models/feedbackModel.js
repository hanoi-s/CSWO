const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    DateCreated: {type: Date},
    ResponseTime: {type: Number, default: 0},
    Accuracy: {type: Number, default: 0},
    Efficiency: {type: Number, default: 0},
    Courtesy: {type: Number, default: 0},
    Remarks: {type: String}
})

module.exports = mongoose.connection.model('Feedback', feedbackSchema);