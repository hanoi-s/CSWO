const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    StatusID: {type: Number, index: true},
    StatusName: {type: String, index: true}
})

module.exports = mongoose.connection.model('Status', statusSchema);