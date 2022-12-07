const mongoose = require('mongoose');
const Requester = require('./requesterModel').schema;
const Employee = require('./employeeModel').schema;
const Status = require('./statusModel').schema;
const Category = require('./categoryModel').schema;
const Type = require('./typeModel').schema;

const requestSchema = new mongoose.Schema({
    Location: {type: String, required: true},
    Item: {type: String, required: true},
    Details: {type: String},
    Remarks: {type: String},    // Different from Requester Feedback. Remarks are to be filled up by CSWO stating the action taken / problems encountered
    DateTarget: {type: Date, required: true},
    DateReceived: {type: Date, required: true},
    DateCompleted: {type: Date},
    DateApproved: {type: Date},
    Workers: {type: Array},
    Status: Status,
    Category: Category,
    Type: Type,
    InCharge: Employee,
    Requester: Requester
});
module.exports = mongoose.connection.model('Request', requestSchema);