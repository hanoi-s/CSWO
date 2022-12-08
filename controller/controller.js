const db = require('../models/db.js');
const RequestModel = require('../models/requestModel.js');
const RequesterModel = require('../models/requesterModel.js');
const EmployeeModel = require('../models/employeeModel.js');
const TypeModel = require('../models/typeModel.js');
const CategoryModel = require('../models/categoryModel.js');
const StatusModel = require('../models/statusModel.js');
const CriteriasModel = require('../models/criteriasModel.js');
const FeedbackModel = require('../models/feedbackModel.js');
// const ShortUID = require('short-uid');

const controller = {
    getDashboard: function (req, res) {
        // Renders dashboard page with all requests from database
        RequestModel.find( {} ).sort({ DateReceived: 'asc' }).then((workOrders) => { 
                res.render('dashboard', {request:workOrders});  
        });
    },

    getNewOrder: function (req, res) {
        // Renders new order page with data coming from database such as types, categories, employees, and status

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
        // Renders work order page catering to a specific work order request
        // also with data coming from database such as types, categories, employees, and status

        // Query for reading all Types from the Database
        db.findMany(TypeModel, {}, {}, function(typesresult){
            // Query for reading all Categories from the Database
            db.findMany(CategoryModel, {}, {}, function(categoriesresult){
                // Query for reading all Employees from the Database
                db.findMany(EmployeeModel, {}, {}, function(employeesresult){
                    // Query for reading all Statuses from the Database
                    db.findMany(StatusModel, {}, {}, function(statusesresult){
                        db.findMany(CriteriasModel, {}, {}, function(criteriasresult) {
                            db.findOne(RequestModel, {_id: req.params.woid}, {}, function(result){
                                res.render('workorder', {request:result, type:typesresult, category:categoriesresult, employee:employeesresult, status:statusesresult, criterias:criteriasresult});
                            });
                        });
                    });
                });
            });
        });
    },
    
    getSummary: function (req, res) {
        RequestModel.find( {} ).count().then((totalWorkOrders) => { 
            RequestModel.find( {"Status.StatusName": "Pending for Approval"} ).count().then((pending) => { 
                RequestModel.find( {"Status.StatusName": "Approved"} ).count().then((approved) => { 
                    RequestModel.find( {"Status.StatusName": "Completed"} ).count().then((completed) => { 
                        res.render('summary', {Total:totalWorkOrders, Pending:pending, Approved:approved, Completed:completed});
                    })
                })
            })
        })
    },

    postNewOrder: async function(req, res) {
        // This is what happens in order to create a single work order

        const feedback = new FeedbackModel({
            DateCreated: null,
            Remarks: null
        });

        // Creates a new Requester instance
        // Collects the information from the form (req.body...)
        const requester = new RequesterModel({
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            Email: req.body.email,
            Department: req.body.address,
            Feedback: feedback
        })
    
        // Collects the information from the form
        // They are separated because they are objects.
        // We are storing their value to use in finding them on the DB
        var CATEGORY = req.body.workCtg;
        var TYPE = req.body.workType;
        var INCHARGE = req.body.incharge;
        var STATUS = req.body.status;

        if (STATUS == "Approved") {
            var DATEAPPROVED = new Date();
        } else {
            var DATEAPPROVED = null;
        }

        // Searches the database for the four variables above 
        // as they are data already found on the database
        TypeModel.findOne({TypeName:TYPE}).then((type) => {
            CategoryModel.findOne({ CategoryName:CATEGORY}).then((category) => {
                EmployeeModel.findOne({ FirstName:INCHARGE}).then((incharge) => {
                    StatusModel.findOne({ StatusName:STATUS}).then((status) => {
                        // Creates a new Request instance with all the information collected
                        // both from the form and the database
                        const request = new RequestModel({
                            Location: req.body.location,
                            Item: req.body.item,
                            Details: req.body.details,
                            DateTarget: req.body.targetdate,
                            DateReceived: new Date(),
                            DateApproved: DATEAPPROVED,
                            DateCompleted: null,
                            Requester: requester,       // This is where new Requester instance is stored
                            Status: status,             // This is where the data from db is stored
                            Category: category,         // This is where the data from db is stored
                            Type: type,                 // This is where the data from db is stored
                            InCharge: incharge,         // This is where the data from db is stored
                        });

                        // request.save() - Saves the new Request instance on the database
                        request.save()
                        .then((result) => {
                            requester.save();               // requester.save() - Saves the new Requester information instance on the database
                            res.redirect('/dashboard');     // Redirects the user on the dashboard to view new work order
                        });
                    })
                })
            })
        })
    },

    postUpdateOrder: async function(req, res) {
        // Collects the information from the form
        var LOCATION = req.body.location;
        var ITEM = req.body.item;
        var CATEGORY = req.body.workCtg;
        var TYPE = req.body.workType;
        var DATETARGET = req.body.DateTarget;
        var DETAILS = req.body.details;
        var INCHARGE = req.body.incharge;
        var STATUS = req.body.status;

        var FIRSTNAME = req.body.firstName;
        var LASTNAME = req.body.lastName;
        var EMAIL = req.body.email;
        var ADDRESS = req.body.address;
        
        var array = req.body.workers;
        var WORKER_ARRAY = array.split(", ");
        var REMARKS = req.body.remarks;     // by cswo      
       
        // If status was changed to Approved or Completed,
        // Date Approved or Date Completed is given a new Date/Timestamp
        // Else they are null
        switch(STATUS) {
            case "Approved":
                var DATEAPPROVED = new Date();
                break;
            case "Completed":
                var DATECOMPLETED = new Date();
                break;
            default:
                var DATEAPPROVED = null;
                var DATECOMPLETED = null;
                var FEEDBACK_DATECREATED = null;
        }

        if(req.body.feedback) {
            var FEEDBACK_DATECREATED = new Date();
        } else {
            var FEEDBACK_DATECREATED = null;
        }

        console.log(FEEDBACK_DATECREATED)

        // console.log(feedback)

        // Searches the database for the four variables above 
        // as they are data already found on the database
        TypeModel.findOne({TypeName:TYPE}).then((type) => {
        CategoryModel.findOne({ CategoryName:CATEGORY }).then((category) => {
        EmployeeModel.findOne({ FirstName:INCHARGE }).then((incharge) => {
        StatusModel.findOne({ StatusName:STATUS }).then((status) => {
        RequestModel.updateOne({_id: req.params.woid}, 
            {$set: {
                Location: LOCATION,
                Item: ITEM,
                Category: category,         // This is where the data from db is stored
                Type: type,                 // This is where the data from db is stored
                DateTarget: DATETARGET,
                Details: DETAILS,
                InCharge: incharge,         // This is where the data from db is stored
                Status: status,             // This is where the data from db is stored

                DateApproved: DATEAPPROVED,
                DateCompleted: DATECOMPLETED,
                Remarks: REMARKS,
                Workers: WORKER_ARRAY,
                Requester: {
                    FirstName: FIRSTNAME,
                    LastName: LASTNAME,
                    Email: EMAIL,
                    Department: ADDRESS,
                    Feedback: {
                        DateCreated: FEEDBACK_DATECREATED,
                        ResponseTime: req.body.responsetime,
                        Accuracy: req.body.accuracy,
                        Efficiency: req.body.efficiency,
                        Courtesy: req.body.courtesy,
                        Remarks: req.body.feedback,  // by requester
                    }
                }
                
                
            }}, function(request){
                RequestModel.findOne({_id: req.params.woid}, {}, function(result2){
                    res.redirect('/workorder/' + req.params.woid);
                });
            })
            })
            })
            })
        })
    },

    postDeleteOrder: async function(req, res) {
        // RequestModel.findByIdAndDelete(req.body.woid, function(err, result){
        //     res.redirect('/');
        // });

        RequestModel.updateOne({_id: req.body.woid}, 
            {$set: {
                Disabled: true
            }}, function(request){
                res.redirect('/');
            })



    },

    postSearchOrders: async function(req, res) {
        var slash = "\\"
        var regKey = slash + req.body.keyword + slash

        RequestModel.find({$text: {$search: regKey}}).then((requests) => {
            res.render('searchorders', {request:requests});  
        })
    },

    postDateRange: async function(req, res) {

        // Returns data regardless of Status within date range
        if(req.body.status == "All") {
            const startdate = req.body.startdate;
            const conStartdate = new Date(startdate);
    
            const enddate = req.body.enddate;
            const conEnddate = new Date(enddate);

            if (req.body.keyword) {
                var slash = "\\"
                var regKey = slash + req.body.keyword + slash
                RequestModel.find({DateReceived: {$gte: conStartdate, $lte: conEnddate}, $text: {$search: regKey}}).sort({ DateReceived: 'asc' }).then((requests) => {
                    RequestModel.find({DateReceived: {$gte: conStartdate, $lte: conEnddate}, $text: {$search: regKey}}).count().then((totalCount) => {
                        RequestModel.find( {} ).count().then((totalWorkOrders) => { 
                            RequestModel.find( {"Status.StatusName": "Pending for Approval"} ).count().then((pending) => { 
                                RequestModel.find( {"Status.StatusName": "Approved"} ).count().then((approved) => { 
                                    RequestModel.find( {"Status.StatusName": "Completed"} ).count().then((completed) => { 
                                        var hasResult = true;
                                        res.render('summary', {request:requests, Total:totalWorkOrders, Pending:pending, Approved:approved, Completed:completed, start:req.body.startdate, end:req.body.enddate, status:req.body.status, totalResults:totalCount, hasResult:hasResult});
                                    })
                                })
                            })
                        })
                    })
                });
            } else {
                RequestModel.find({DateReceived: {$gte: conStartdate, $lte: conEnddate}}).sort({ DateReceived: 'asc' }).then((requests) => {
                    RequestModel.find({DateReceived: {$gte: conStartdate, $lte: conEnddate}}).count().then((totalCount) => {
                        RequestModel.find( {} ).count().then((totalWorkOrders) => { 
                            RequestModel.find( {"Status.StatusName": "Pending for Approval"} ).count().then((pending) => { 
                                RequestModel.find( {"Status.StatusName": "Approved"} ).count().then((approved) => { 
                                    RequestModel.find( {"Status.StatusName": "Completed"} ).count().then((completed) => { 
                                        var hasResult = true;
                                        res.render('summary', {request:requests, Total:totalWorkOrders, Pending:pending, Approved:approved, Completed:completed, start:req.body.startdate, end:req.body.enddate, status:req.body.status, totalResults:totalCount, hasResult:hasResult});
                                    })
                                })
                            })
                        })
                    })
                });
            }
        } else {
            // Returns data depending on the Status within date range
            // Has status, has keyword, has date range
            const status = req.body.status;
            const startdate = req.body.startdate;
            const conStartdate = new Date(startdate);
    
            const enddate = req.body.enddate;
            const conEnddate = new Date(enddate);

            if (req.body.keyword) {
                var slash = "\\"
                var regKey = slash + req.body.keyword + slash

                RequestModel.find({ DateReceived: {$gte: conStartdate, $lte: conEnddate}, $text: {$search: regKey}, "Status.StatusName": status }).sort({ DateReceived: 'asc' }).then((requests) => {
                    RequestModel.find({DateReceived: {$gte: conStartdate, $lte: conEnddate}, $text: {$search: regKey}, "Status.StatusName": status}).count().then((totalCount) => {
                        RequestModel.find( {} ).count().then((totalWorkOrders) => { 
                            RequestModel.find( {"Status.StatusName": "Pending for Approval"} ).count().then((pending) => { 
                                RequestModel.find( {"Status.StatusName": "Approved"} ).count().then((approved) => { 
                                    RequestModel.find( {"Status.StatusName": "Completed"} ).count().then((completed) => { 
                                        var hasResult = true;
                                        res.render('summary', {request:requests, Total:totalWorkOrders, Pending:pending, Approved:approved, Completed:completed, start:req.body.startdate, end:req.body.enddate, status:req.body.status, totalResults:totalCount, hasResult:hasResult});
                                    })
                                })
                            })
                        })
                    })
                });
            } else {
                RequestModel.find({ DateReceived: {$gte: conStartdate, $lte: conEnddate}, "Status.StatusName": status }).sort({ DateReceived: 'asc' }).then((requests) => {
                    RequestModel.find({DateReceived: {$gte: conStartdate, $lte: conEnddate}, "Status.StatusName": status}).count().then((totalCount) => {
                        RequestModel.find( {} ).count().then((totalWorkOrders) => { 
                            RequestModel.find( {"Status.StatusName": "Pending for Approval"} ).count().then((pending) => { 
                                RequestModel.find( {"Status.StatusName": "Approved"} ).count().then((approved) => { 
                                    RequestModel.find( {"Status.StatusName": "Completed"} ).count().then((completed) => { 
                                        var hasResult = true;
                                        res.render('summary', {request:requests, Total:totalWorkOrders, Pending:pending, Approved:approved, Completed:completed, start:req.body.startdate, end:req.body.enddate, status:req.body.status, totalResults:totalCount, hasResult:hasResult});
                                    })
                                })
                            })
                        })
                    })
                });
            } 
        }
    }

}

// Export this file for other files to find
module.exports = controller;