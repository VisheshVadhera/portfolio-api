/**
 * Created by vishesh on 17/6/17.
 */

var mongoose = require('mongoose');
var _ = require('lodash');
var flat = require('flat');
var request = require('request');

var errorFactory = require('../../utils/errorFactory');

var Portfolio = require('./portfolio.model');
var Trade = require('../trade/trade.model');
var Stock = require('../stock/stock.model');

module.exports.getPortfolio = function (req, res) {

    //Get the portfolio along with the related trade and stock models.
    Portfolio
        .findOne({name: "sample"})
        .populate({
            path: 'trades',
            model: 'Trade',
            populate: {
                path: 'stock',
                model: 'Stock'
            }
        })
        .exec(function (err, portfolio) {

            if (err) return res.status(500).send(errorFactory.createError("Unable to get portfolio."));

            res.send(portfolio);
        })
}

module.exports.removeTrade = function (req, res) {

    var tradeId = req.params.tradeId;

    //First remove the trade with tradeId and then remove the corresponding tradeId from the trades array in the portfolios collection.
    Trade.findByIdAndRemove(tradeId, function (err, trade) {

        if (err) return res.status(500).send(errorFactory.createError("Unable to remove the trade."));

        Portfolio.findOneAndUpdate({
                name: "sample"
            },
            {
                $pullAll: {
                    trades: [
                        mongoose.Types.ObjectId(tradeId)
                    ]
                }
            }, function (err, portfolio) {

                if (err) return res.status(500).send(errorFactory.createError("Unable to remove the trade"));

                res.status(200).send("Trade with id " + tradeId + " has been removed");
            });
    });
}

module.exports.addTrade = function (req, res) {

    var input = req.body;

    //For adding the trade, first check if the stocks table has the stock sent by the user.
    //If it has, then move on to the next step else add this stock to the stocks table.

    Stock.findOrCreate(
        {symbol: _.get(input, 'stock.symbol')},
        {name: _.get(input, 'stock.name')},
        function (err, stock) {

            if (err) return res.status(500).send(errorFactory.createError("Unable to add trade."));

            //Once stock has been added or found, add the trade to the db and attach the stockId to it.
            var trade = new Trade({
                tradeType: _.get(input, 'tradeType'),
                price: _.get(input, 'price'),
                count: _.get(input, 'count'),
                stock: stock._id
            });

            trade.save(function (err) {

                if (err) return res.status(500).send("Unable to add trade");

                //After adding the trade to the trades table, add the trades._id to the trades array in the portfolio and complete.
                Portfolio.update(
                    {name: "sample"},
                    {$push: {trades: trade._id}},
                    function (err, portfolio) {

                        if (err) return res.status(500).send("Unable to add trade");

                        res.status(200).send(trade);
                    })
            })
        })
};

module.exports.updateTrade = function (req, res) {

    var input = req.body;

    //Find the trade with the given id and update only the tradeType, count and price of the trades instance,
    //do not update the rest of the fields.
    Trade.findById(input._id, function (err, trade) {

        if (err) return res.status(500).send("Unable to update the trade");

        trade.tradeType = input.tradeType;
        trade.price = input.price;
        trade.count = input.count;

        trade.save(function (err, updatedTrade) {

            if (err) return res.status(500).send("Unable to update the trade");

            res.status(200).send(updatedTrade);
        })
    })
};

module.exports.getCumulativeReturn = function (req, res) {

    //Get all the trades and the corresponding stocks.
    Trade.find()
        .populate('stock')
        .exec(function (err, trades) {

            if (err) return res.status(500).send("Unable to get the returns");

            //Pick only the relevant fields from the trades and ignore the rest and afterwards flatten the structure of the result.
            var flattenedTrades = getFlattenedTrades(trades);
            var portfolioValue = calculatePortfolioValue(flattenedTrades);

            // Array of symbols of stocks present in portfolio;
            var stocksInPortfolio = Object.keys(flattenedTrades);
            //Url to fetch the latest stock prices
            var url = getStocksPricesUrl(stocksInPortfolio);

            request(url, function (err, response, stockPrices) {

                if (err) return res.status(500).send("Unable to get the returns");

                //The result returned by the api has three redundant chars in the beginning which are "// ".
                // Hence we need to remove them and convert the result to JSON.
                stockPrices = JSON.parse(stockPrices.slice(4, stockPrices.length));
                var currentPortfolioValue = 0;

                for (var i in stocksInPortfolio) {

                    var totalShares = getTotalShares(flattenedTrades[stocksInPortfolio[i]]);
                    var latestStockPrice = extractLatestStockPrice(stocksInPortfolio[i], stockPrices);

                    currentPortfolioValue += totalShares * latestStockPrice;
                }

                var cumulativeReturn = (currentPortfolioValue - portfolioValue) / portfolioValue;

                res.status(200).send({returns: cumulativeReturn * 100});
            });
        })
};

module.exports.getHoldings = function (req, res) {

    Trade
        .find()
        .populate('stock')
        .exec(function (err, trades) {

            if (err) return res.status(500).send("Unable to get the holdings");

            var flattenedTrades = getFlattenedTrades(trades);
            var holdings = {};

            for (var key in flattenedTrades) {
                if (flattenedTrades.hasOwnProperty(key)) {

                    var array = flattenedTrades[key];

                    var totalShares = getTotalShares(array);

                    var averageOfBoughtShares = getAverageOfBoughtShares(array);

                    holdings[key] = {
                        count: totalShares,
                        avgPrice: averageOfBoughtShares
                    }
                }
            }

            res.status(200).send(holdings);
        });
}

function getFlattenedTrades(trades) {

    var flattened = _.map(trades, function (trade) {
        return flat(_.pick(trade, 'tradeType', 'price',
            'stock.name', 'stock.symbol', 'count'));
    });

    var groupedBySymbolTrades = _.groupBy(flattened, 'stock.symbol');

    return groupedBySymbolTrades;
}

/**
 * Returns the average price of the shares bought for a particular stock.
 *
 * @param tradesArray
 * @returns {number}
 */
function getAverageOfBoughtShares(tradesArray) {

    var totalSharesBought = 0;
    var totalValueInBoughtShares = 0;

    for (var i in tradesArray) {

        var trade = tradesArray[i];

        if (trade.tradeType === 'BUY') {

            totalSharesBought += trade.count;
            totalValueInBoughtShares += trade.count * trade.price;
        }
    }

    return totalValueInBoughtShares / totalSharesBought;
}

/**
 * Returns the total number of shares (bought-sold) being held for a particular stock.
 *
 * @param tradesArray
 * @returns {number}
 */
function getTotalShares(tradesArray) {

    var totalNoOfShares = 0;

    for (var i in tradesArray) {

        var trade = tradesArray[i];

        totalNoOfShares = trade.tradeType === 'BUY'
            ? totalNoOfShares + trade.count
            : totalNoOfShares - trade.count;
    }

    return totalNoOfShares;
}

/**
 * Returns the value of the portfolio.
 *
 * @param flattenedTrades
 * @returns {number}
 */
function calculatePortfolioValue(flattenedTrades) {

    var value = 0;

    for (key in flattenedTrades) {

        var tradesArray = flattenedTrades[key];

        for (var i in tradesArray) {

            var trade = tradesArray[i];

            value = trade.tradeType === 'BUY'
                ? value + trade.count * trade.price
                : value - trade.count * trade.price;
        }
    }

    return value;
}

/**
 * Gets the price of the stock with the symbol stockSymbol from the stockPrices array.
 *
 * @param stockSymbol stock whose price needs to be extracted.
 * @param stockPrices array of values returned by Google Finance.
 * @returns {Number}
 */
function extractLatestStockPrice(stockSymbol, stockPrices) {

    for (var i in stockPrices) {
        if (stockPrices[i].t === stockSymbol) {
            return parseFloat(stockPrices[i].l_fix);
        }
    }
}

/**
 * Creates the Google Finance URL to fetch the stock prices.
 *
 * @param stocksInPortfolio array containing symbols of stocks.
 * @returns {string} url
 */
function getStocksPricesUrl(stocksInPortfolio) {
    var url = "http://finance.google.com/finance/info?client=ig&q=";

    for (var i in stocksInPortfolio) {
        url += "NSE:" + stocksInPortfolio[i] + ",";
    }

    url = url.slice(0, url.length);
    return url;
}