const mongoose = require('mongoose');
const Requester = require('./requesterModel').schema;
const Employee = require('./employeeModel').schema;

const requestSchema = new mongoose.Schema({
    RequestID: {type: Number},
    Status: {type: String, default: "Pending for Approval"},
    Location: {type: String, required: true},
    Item: {type: String, required: true},
    Category: {type: String, required: true},
    Type: {type: String, required: true},
    Details: {type: String, required: true},
    DateTarget: {type: String, required: true},
    DateCompleted: {type: String},
    DateApproved: {type: String},
    DateReceived: {type: String, required: true},
    InCharge: Employee,
    Requester: Requester
})

module.exports = mongoose.connection.model('Request', requestSchema);