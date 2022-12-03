const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    FirstName: {type: String, index: true},
    LastName: {type: String, index: true},
    Email: {type: String, index: true},
    Department: {type: String, index: true}
})
module.exports = mongoose.connection.model('Employee', employeeSchema);