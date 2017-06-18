/**
 * Created by vishesh on 17/6/17.
 */

var mongoose = require('mongoose');

var Portfolio = require('./api/portfolio/portfolio.model');
var Stock = require('./api/stock/stock.model');
var Trade = require('./api/trade/trade.model');

var hdfcStock = new Stock({
    name: "HDFC",
    symbol: "HDFC"
});

var abbStock = new Stock({
    name: "Abb",
    symbol: "ABB"
});

var bhelStock = new Stock({
    name: "Bhel",
    symbol: "BHEL"
});

var hdfcTrade = new Trade({
    tradeType: "BUY",
    price: 1640,
    stock: hdfcStock._id,
    count: 140
});

var hdfcTrade2 = new Trade({
    tradeType: "SELL",
    price: 1630,
    stock: hdfcStock._id,
    count: 10
});

var hdfcTrade3 = new Trade({
    tradeType: "BUY",
    price: 1650,
    stock: hdfcStock._id,
    count: 10
});

var abbTrade = new Trade({
    tradeType: "BUY",
    price: 1500,
    stock: abbStock._id,
    count: 100
});

var abbTrade2 = new Trade({
    tradeType: "BUY",
    price: 1490,
    stock: abbStock._id,
    count: 20
});

var abbTrade3 = new Trade({
    tradeType: "SELL",
    price: 1510,
    stock: abbStock._id,
    count: 50
});

var bhelTrade = new Trade({
    tradeType: "BUY",
    price: 140,
    stock: bhelStock._id,
    count: 50
});

var bhelTrade2 = new Trade({
    tradeType: "BUY",
    price: 120,
    stock: bhelStock._id,
    count: 100
});

var bhelTrade3 = new Trade({
    tradeType: "SELL",
    price: 150,
    stock: bhelStock._id,
    count: 20
});

var portfolio = new Portfolio({
    name: "sample",
    trades: [bhelTrade._id, hdfcTrade._id, abbTrade._id,
        bhelTrade2._id, hdfcTrade2._id, abbTrade2._id,
        bhelTrade3._id, hdfcTrade3._id, abbTrade3._id,]
});

mongoose.connect('mongodb://127.0.0.1:27017/portfolio');
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open');

    hdfcStock.save(function () {
        abbStock.save(function () {
            bhelStock.save(function () {

                hdfcTrade.save(function () {
                    abbTrade.save(function () {
                        bhelTrade.save(function () {
                            hdfcTrade2.save(function () {
                                hdfcTrade3.save(function () {
                                    abbTrade2.save(function () {
                                        abbTrade3.save(function () {
                                            bhelTrade2.save(function () {
                                                bhelTrade3.save(function () {
                                                    portfolio.save(function () {

                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        });
                    });
                });
            });
        });
    });
});

mongoose.connection.on('error', function (err) {
    console.error.bind(console, 'Mongoose connection error');
    process.exit(-1);
});
