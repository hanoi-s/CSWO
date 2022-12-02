const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    CategoryID: {type: Number},
    CategoryName: {type: String}
})

module.exports = mongoose.connection.model('Category', categorySchema);