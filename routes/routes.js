const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const controller = require('../controller/controller.js');
const RequestModel = require('../models/requestModel.js');
const RequesterModel = require('../models/requesterModel.js');
const { application } = require('express');

// express app (used 'routes')
const routes = express();

routes.use(session({
    secret: 'CSWOSecret',
    resave: true,
    saveUninitialized: true,
    cookieName: 'session'
}))


routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended : true}));


// Getting pages
routes.get('/', controller.getDashboard);
routes.get('/notfound', controller.getNotFound);
routes.get('/noaccess', controller.getNoAccess);
routes.get('/dashboard', controller.getDashboard);
routes.get('/edit/:woid', controller.getWorkOrder);
routes.get('/view/:woid', controller.viewWorkOrder);
routes.get('/new', controller.getNewOrder);
routes.get('/summary', controller.getSummary);
routes.get('/register', controller.getRegister);
routes.get('/login', controller.getLogin);
routes.get('/auditlogs', controller.getAuditLogs);
routes.get('/viewAudit/:woid', controller.viewWorkOrderAudit);
routes.post('/postNewOrder', controller.postNewOrder);              // Creating a Work Order
routes.post('/edit/:woid/update', controller.postUpdateOrder);      // Editing a Work Order
routes.post('/edit/delete', controller.postDeleteOrder);            // Deleting a Work Order
routes.post('/postRegister', controller.postRegister);              // Creating a New User
routes.post('/postLogin', controller.postLogin);                    // Logging in
routes.get('/logout', controller.getLogout);                        // Logging out


// Search DB
routes.post('/searchDashboard', controller.postSearchOrders);
routes.post('/searchAudit', controller.postSearchAudits);
routes.post('/summary/daterange', controller.postDateRange);// get date range

// Print
routes.get('/print/:woid', controller.getPrintWorkOrder);

// Export this file for other files to find
module.exports = routes;