
var express = require('express');
var mongoose = require('mongoose');
var dbConfig = require('../config/dbConfig.json');


mongoose.connect(dbConfig.dbStringProd);
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open');
})
mongoose.connection.on('error', function (err) {
    console.error.bind(console, 'Mongoose connection error');
    process.exit(-1);
});


/**
 * Why are the following three lines required?
 * If the following lines are absent then an attempt to fetch the portfolio model along with
 * the trades and stock would lead to a "Uncaught MissingSchemaError: Schema hasn't been registered for model "Trade".
 * Use mongoose.model(name, schema)", See the stackoverflow thread:
 * https://stackoverflow.com/questions/26818071/mongoose-schema-hasnt-been-registered-for-model
 */
require('./api/trade/trade.model');
require('./api/portfolio/portfolio.model');
require('./api/stock/stock.model');

var app = express();
var server = require('http').createServer(app);
require('./express')(app);
require('./routes')(app);


app.listen(3000, function () {
    console.log('Smallcase Portfolio API listening on 3000!')
})

module.exports = app;
