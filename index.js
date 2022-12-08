const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');

const db = require('./models/db.js');
const routes = require('./routes/routes.js');

// express app
const app = express();

// set view engine as handlebars (hbs)
app.set('view engine', 'hbs');

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('dateFormat', function(arg1) {

    var year = arg1.getFullYear().toString();
    var month = arg1.toLocaleString('en-US', { month: 'short' }).toString();
    var day = arg1.getDate().toString();

    var hour0 = arg1.getHours();

    var dayOrNight = "AM";
    if (hour0 > 11) { dayOrNight = "PM"};
    
    
    var hour = String(hour0 % 12 || 12).padStart(2, "0"); 
    var minute = arg1.getMinutes().toString().padStart(2, "0");

    var date = month + " " + day + ", " + year + " - " + hour + ":" + minute + " " + dayOrNight;
    return date;
});

hbs.registerHelper('dateWithoutTime', function(arg1) {

    var year = arg1.getFullYear().toString();
    var month = arg1.toLocaleString('en-US', { month: 'short' }).toString();
    var day = arg1.getDate().toString();

    var date = month + " " + day + ", " + year;
    return date;
});

// hbs.registerHelper('onlyDate', function(arg1) {

//     var year = arg1.getFullYear().toString();
//     var month0 = arg1.getMonth();
//     var month1 = month0 + 1;
//     var month = month1.toString().padStart(2, "0");
//     var day = arg1.getDate().toString().padStart(2, "0");

//     var date = month + "/" + day + "/" + year;
//     return date;
// });

// for routes
app.use('/', routes);

// for logo
app.use(express.static('public'));

db.connect();
 
// listen for requests
app.listen(3000, () => {
    console.log("Server started on port 3000");
});