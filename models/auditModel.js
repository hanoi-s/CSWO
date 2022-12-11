const mongoose = require('mongoose');
const User = require('./userModel').schema;
const Request = require('./requestModel').schema;

const auditSchema = new mongoose.Schema({
    DateCreated: {type: Date},
    Action: {type: String},
    User: User,
    Request: Request
})

module.exports = mongoose.connection.model('Audit', auditSchema);