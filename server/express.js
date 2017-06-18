
var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app) {

    var env = app.get('env');

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(bodyParser.json());
};