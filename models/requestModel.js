const mongoose = require('mongoose');
const Requester = require('./requesterModel').schema;
const Employee = require('./employeeModel').schema;
const Status = require('./statusModel').schema;
const Category = require('./categoryModel').schema;
const Type = require('./typeModel').schema;

const requestSchema = new mongoose.Schema({
    RequestID: {type: Number},
    Location: {type: String, required: true},
    Item: {type: String, required: true},
    // Category: {type: String, required: true},
    // Type: {type: String, required: true},
    // Status: {type: String, required: true},
    Details: {type: String, required: true},
    DateTarget: {type: String, required: true},
    DateCompleted: {type: String},
    DateApproved: {type: String},
    DateReceived: {type: String, required: true},
    Status: Status,
    Category: Category,
    Type: Type,
    InCharge: Employee,
    Requester: Requester
})

module.exports = mongoose.connection.model('Request', requestSchema);