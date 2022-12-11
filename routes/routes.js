const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controller/controller.js');
const RequestModel = require('../models/requestModel.js');
const RequesterModel = require('../models/requesterModel.js');
const { application } = require('express');

// express app (used 'routes')
const routes = express();

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended : true}));


// Getting HTML pages
routes.get('/', controller.getDashboard);
routes.get('/dashboard', controller.getDashboard);
routes.get('/edit/:woid', controller.getWorkOrder);
routes.get('/viewwo/:woid', controller.viewWorkOrder);
routes.get('/neworder', controller.getNewOrder);
routes.get('/summary', controller.getSummary);


// Writing on DB
routes.post('/postNewOrder', controller.postNewOrder);
routes.post('/edit/:woid/update', controller.postUpdateOrder);

// Deleting on DB
routes.post('/edit/delete', controller.postDeleteOrder);

// Search DB
routes.post('/searchorders', controller.postSearchOrders);

routes.post('/summary/daterange', controller.postDateRange);// get date range

// Print
// routes.post('/edit/:woid', controller.postPrintWorkOrder);


// Export this file for other files to find
module.exports = routes;