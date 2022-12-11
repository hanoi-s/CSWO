const PDFDocument = require('pdfkit');
const RequestModel = require('../models/requestModel.js');
const RequesterModel = require('../models/requesterModel.js');
const EmployeeModel = require('../models/employeeModel.js');
const TypeModel = require('../models/typeModel.js');
const CategoryModel = require('../models/categoryModel.js');
const StatusModel = require('../models/statusModel.js');
const CriteriasModel = require('../models/criteriasModel.js');
const FeedbackModel = require('../models/feedbackModel.js');

// function buildPDF(dataCallback, endCallback) {
//     // const doc = new PDFDocument();
//     // doc.on('data', dataCallback);
//     // doc.on('end', endCallback);
//     // doc.fontSize(20).text("Some text");
//     // doc.end();

//     console.log("buildpdf")
//     console.log(req.session.email)
// }



module.exports = { buildPDF };