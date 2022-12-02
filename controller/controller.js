const db = require('../models/db.js');
const RequestModel = require('../models/requestModel.js');
const RequesterModel = require('../models/requesterModel.js');
const EmployeeModel = require('../models/employeeModel.js');
const TypeModel = require('../models/typeModel.js');
const CategoryModel = require('../models/categoryModel.js');
const StatusModel = require('../models/statusModel.js');

const controller = {
    getDashboard: function (req, res) {
        db.findRequests(RequestModel, {}, {}, function(result){
            // console.log(result);
            res.render('dashboard', {request:result});
        });
    },

    getNewOrder: function (req, res) {

        // Query for reading all Types from the Database
        db.findMany(TypeModel, {}, {}, function(typesresult){
            // Query for reading all Categories from the Database
            db.findMany(CategoryModel, {}, {}, function(categoriesresult){
                // Query for reading all Employees from the Database
                db.findMany(EmployeeModel, {}, {}, function(employeesresult){
                    // Query for reading all Statuses from the Database
                    db.findMany(StatusModel, {}, {}, function(statusesresult){
                        res.render('neworder', {type:typesresult, category:categoriesresult, employee:employeesresult, status:statusesresult});
                    });
                });
            });
        });

    },

    getWorkOrder: function (req, res) {

        // Query for reading all Types from the Database
        db.findMany(TypeModel, {}, {}, function(typesresult){
            // Query for reading all Categories from the Database
            db.findMany(CategoryModel, {}, {}, function(categoriesresult){
                // Query for reading all Employees from the Database
                db.findMany(EmployeeModel, {}, {}, function(employeesresult){
                    // Query for reading all Statuses from the Database
                    db.findMany(StatusModel, {}, {}, function(statusesresult){
                        db.findOne(RequestModel, {_id: req.params.woid}, {}, function(result){
                            // // console.log(result.Location) // undefined
                            // console.log(String(result.Location));
                            // res.render('workorder', {request:result});
                            res.render('workorder', {request:result, type:typesresult, category:categoriesresult, employee:employeesresult, status:statusesresult});
                        });
                        
                    });
                });
            });
        });
    },
    
    getSummary: function (req, res) {
        res.render('summary');
    },

    postNewOrder: async function(req, res) {

        // Generate the timestamp for DateReceived (Timestamp that the Work Order was created)
        var today = new Date();
        var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var datetime = date+' '+time;

        // Creates a new Requester instance
        // Collects the information from the form (req.body...)
        const requester = new RequesterModel({
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            Email: req.body.email,
            Department: req.body.address
        })
    
        // Collects the information from the form
        var CATEGORY = req.body.workCtg;
        var TYPE = req.body.workType;
        var INCHARGE = req.body.incharge;
        var STATUS = req.body.status;

        // Searches the database for the four variables above 
        // as they are data already found on the database
        TypeModel.findOne({TypeName:TYPE}).then((type) => {
            CategoryModel.findOne({ CategoryName:CATEGORY}).then((category) => {
                EmployeeModel.findOne({ FirstName:INCHARGE}).then((incharge) => {
                    StatusModel.findOne({ StatusName:STATUS}).then((status) => {
                        // console.log(incharge);
                        // console.log(category);
                        // console.log(type);
                        // console.log(status);

                        // Creates a new request instance with all the information collected
                        // both from the form and the database
                        const request = new RequestModel({
                            Location: req.body.location,
                            Item: req.body.item,
                            Details: req.body.details,
                            DateTarget: req.body.targetdate,
                            DateReceived: datetime,
                            DateApproved: null,
                            DateCompleted: null,
                            Requester: requester,       // This is where new requester instance is stored
                            Status: status,             // This is where the data from db is stored
                            Category: category,         // This is where the data from db is stored
                            Type: type,                 // This is where the data from db is stored
                            InCharge: incharge,         // This is where the data from db is stored
                        });

                        // request.save() - Saves the new request instance on the database
                        request.save()
                        .then((result) => {
                            // console.log(result);
                            
                            requester.save();               // requester.save() - Saves the new requester information instance on the database
                            res.redirect('/dashboard');     // Redirects the user on the dashboard to view new work order
                        })
                            .catch((err) => {
                            console.log(err);
                        })
                    })
                })
            })
        })
    

    },

    postUpdateOrder: async function(req, res) {
        var today = new Date();
        var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var datetime = date+' '+time;

        // Collects the information from the form
        var CATEGORY = req.body.workCtg;
        var TYPE = req.body.workType;
        var DATETARGET = req.body.DateTarget;
        var INCHARGE = req.body.incharge;
        var STATUS = req.body.status;

        if (STATUS == "Approved") {
            var DATEAPPROVED = datetime;
        } else {
            var DATEAPPROVED = null;
        }

        // Searches the database for the four variables above 
        // as they are data already found on the database
        TypeModel.findOne({TypeName:TYPE}).then((type) => {
            CategoryModel.findOne({ CategoryName:CATEGORY}).then((category) => {
                EmployeeModel.findOne({ FirstName:INCHARGE}).then((incharge) => {
                    StatusModel.findOne({ StatusName:STATUS}).then((status) => {

                        RequestModel.findOne({_id: req.params.woid}, {}, function(request){
                            RequestModel.updateOne({_id: req.params.woid}, 
                                {$set: {
                                    DateApproved: DATEAPPROVED,
                                    DateTarget: DATETARGET,
                                    Status: status,             // This is where the data from db is stored
                                    Category: category,         // This is where the data from db is stored
                                    Type: type,                 // This is where the data from db is stored
                                    InCharge: incharge,         // This is where the data from db is stored
                                }},
                                function(request){
                                    RequestModel.findOne({_id: req.params.woid}, {}, function(result2){
                                        res.redirect('/workorder/' + req.params.woid);
                                    });
                                })
                        });
                    })
                })
            })
        })
    }
}

// Export this file for other files to find
module.exports = controller;