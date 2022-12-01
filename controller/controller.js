const db = require('../models/db.js');
const RequestModel = require('../models/requestModel.js');
const RequesterModel = require('../models/requesterModel.js');

const controller = {
    getDashboard: function (req, res) {
        db.findRequests(RequestModel, {}, {}, function(result){
            res.render('dashboard', {request:result});
        });
    },

    getNewOrder: function (req, res) {
        res.render('neworder');
    },
    
    getSummary: function (req, res) {
        res.render('summary');
    },

    postNewOrder: async function(req, res) {
        var today = new Date();
        var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var datetime = date+' '+time;
    
        const requester = new RequesterModel({
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            Email: req.body.email,
            Department: req.body.address
        })
    
        const request = new RequestModel({
            Location: req.body.location,
            Item: req.body.item,
            Category: req.body.workCtg,
            Type: req.body.workType,
            Details: req.body.details,
            DateTarget: req.body.date,
            DateReceived: datetime,
            DateApproved: null,
            DateCompleted: null,
            Requester: requester
        });
    
        request.save()
            .then((result) => {
                console.log(result);
                requester.save();
                res.redirect('/dashboard');
        })
            .catch((err) => {
            console.log(err);
        })
    }
}

// Export this file for other files to find
module.exports = controller;