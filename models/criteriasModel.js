const mongoose = require('mongoose');

const criteriasSchema = new mongoose.Schema({
    CriteriaNum: {type: Number},
    CriteriaName: {type: String},
})

module.exports = mongoose.connection.model('Criterias', criteriasSchema);