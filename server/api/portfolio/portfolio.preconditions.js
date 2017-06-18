var _ = require('lodash');
var errorFactory = require('../../utils/errorFactory');

module.exports.checkAddTradePreconditions = function (req, res, next) {

    var input = req.body;

    //Following keys must be present in the json sent by the user.
    if (!_.has(input, 'tradeType') || !_.has(input, 'price') ||
        !_.has(input, 'count') || !_.has(input, 'stock.name') || !_.has(input, 'stock.symbol')) {
        return res.status(422).send(errorFactory.createError("Some fields are missing."));
    }

    next();
};

module.exports.checkUpdateTradePreconditions = function (req, res, next) {

    var input = req.body;

    //Following keys must be present in the json sent by the user.
    if (!_.has(input, 'tradeType') || !_.has(input, 'price')
        || !_.has(input, 'count') || !_.has(input, '_id')) {
        return res.status(422).send(errorFactory.createError("Some fields are missing."));
    }

    next();
};

