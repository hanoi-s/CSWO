const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    FirstName: {type: String, required: true},
    LastName: {type: String, required: true},
    Email: {type: String, required: true},
    Department: {type: String, required: true}
})

module.exports = mongoose.connection.model('Employee', employeeSchema);