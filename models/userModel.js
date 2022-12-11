const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    FirstName: {type: String, requried: true},
    LastName: {type: String, requried: true},
    Email: {type: String, requried: true},
    Password: {type: String, requried: true},
    Admin: {type: Boolean, default: false}
})

module.exports = mongoose.connection.model('User', userSchema);