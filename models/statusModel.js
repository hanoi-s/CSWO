const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    StatusID: {type: String},
    StatusName: {type: String}
})

module.exports = mongoose.connection.model('Status', statusSchema);