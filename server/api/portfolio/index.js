
var express = require('express');
var router = express.Router();

var controller = require('./portfolio.controller');
var preconditions = require('./portfolio.preconditions');

module.exports = router;

router.get('/portfolio', controller.getPortfolio);
router.get('/portfolio/returns', controller.getCumulativeReturn);
router.get('/portfolio/holdings', controller.getHoldings);

router.post('/portfolio/addTrade', preconditions.checkAddTradePreconditions ,controller.addTrade);
router.post('/portfolio/updateTrade/', preconditions.checkUpdateTradePreconditions, controller.updateTrade);
router.post('/portfolio/removeTrade/:tradeId', preconditions.checkRemoveTradePreconditions, controller.removeTrade);
