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

// for routes
app.use('/', routes);

// for logo
app.use(express.static('public'));

db.connect();
 
// listen for requests
app.listen(3000, () => {
    console.log("Server started on port 3000");
});