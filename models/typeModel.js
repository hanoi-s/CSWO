const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    TypeID: {type: Number},
    TypeName: {type: String}
})

module.exports = mongoose.connection.model('Type', typeSchema);