const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    FirstName: {type: String},
    LastName: {type: String},
    Email: {type: String},
    Department: {type: String}
})
module.exports = mongoose.connection.model('Employee', employeeSchema);