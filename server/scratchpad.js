/**
 * Created by vishesh on 17/6/17.
 */

var _ = require('lodash');
var flat = require('flat');
var request = require('request');

var collection = [
    {
        "_id": "59453a10eddc3832cf881b15",
        "tradeType": "BUY",
        "price": 3.5,
        "stock": {
            "_id": "59453a10eddc3832cf881b12",
            "name": "HDFC Bank",
            "symbol": "HDFC",
            "createdAt": "2017-06-17T14:17:52.034Z"
        },
        "count": 140,
        "createdAt": "2017-06-17T14:17:52.049Z"
    },
    {
        "_id": "59453a10eddc3832cf881b18",
        "tradeType": "BUY",
        "price": 9.4,
        "stock": {
            "_id": "59453a10eddc3832cf881b13",
            "name": "Abb",
            "symbol": "ABB",
            "createdAt": "2017-06-17T14:17:52.047Z"
        },
        "count": 100,
        "createdAt": "2017-06-17T14:17:52.054Z"
    },
    {
        "_id": "59453a10eddc3832cf881b1b",
        "tradeType": "BUY",
        "price": 13.4,
        "stock": {
            "_id": "59453a10eddc3832cf881b14",
            "name": "Bharat Heavy Electricals",
            "symbol": "BHEL",
            "createdAt": "2017-06-17T14:17:52.047Z"
        },
        "count": 50,
        "createdAt": "2017-06-17T14:17:52.055Z"
    },
    {
        "_id": "59453a10eddc3832cf881b16",
        "tradeType": "SELL",
        "price": 5.5,
        "stock": {
            "_id": "59453a10eddc3832cf881b12",
            "name": "HDFC Bank",
            "symbol": "HDFC",
            "createdAt": "2017-06-17T14:17:52.034Z"
        },
        "count": 10,
        "createdAt": "2017-06-17T14:17:52.053Z"
    },
    {
        "_id": "59453a10eddc3832cf881b17",
        "tradeType": "BUY",
        "price": 2.5,
        "stock": {
            "_id": "59453a10eddc3832cf881b12",
            "name": "HDFC Bank",
            "symbol": "HDFC",
            "createdAt": "2017-06-17T14:17:52.034Z"
        },
        "count": 10,
        "createdAt": "2017-06-17T14:17:52.053Z"
    },
    {
        "_id": "59453a10eddc3832cf881b19",
        "tradeType": "BUY",
        "price": 11.4,
        "stock": {
            "_id": "59453a10eddc3832cf881b13",
            "name": "Abb",
            "symbol": "ABB",
            "createdAt": "2017-06-17T14:17:52.047Z"
        },
        "count": 20,
        "createdAt": "2017-06-17T14:17:52.054Z"
    },
    {
        "_id": "59453a10eddc3832cf881b1a",
        "tradeType": "SELL",
        "price": 9,
        "stock": {
            "_id": "59453a10eddc3832cf881b13",
            "name": "Abb",
            "symbol": "ABB",
            "createdAt": "2017-06-17T14:17:52.047Z"
        },
        "count": 50,
        "createdAt": "2017-06-17T14:17:52.055Z"
    },
    {
        "_id": "59453a10eddc3832cf881b1c",
        "tradeType": "BUY",
        "price": 11.4,
        "stock": {
            "_id": "59453a10eddc3832cf881b14",
            "name": "Bharat Heavy Electricals",
            "symbol": "BHEL",
            "createdAt": "2017-06-17T14:17:52.047Z"
        },
        "count": 100,
        "createdAt": "2017-06-17T14:17:52.055Z"
    },
    {
        "_id": "59453a10eddc3832cf881b1d",
        "tradeType": "SELL",
        "price": 12.4,
        "stock": {
            "_id": "59453a10eddc3832cf881b14",
            "name": "Bharat Heavy Electricals",
            "symbol": "BHEL",
            "createdAt": "2017-06-17T14:17:52.047Z"
        },
        "count": 20,
        "createdAt": "2017-06-17T14:17:52.056Z"
    }
];

var flattened = _.map(collection, function (trade) {
    return flat(_.pick(trade, 'tradeType', 'price',
        'stock.name', 'stock.symbol', 'count'));
});

var grouped = _.groupBy(flattened, 'stock.symbol');

var getHoldingShares = function (array) {

    var totalNoOfShares = 0;

    for (var i in array) {

        var trade = array[i];

        totalNoOfShares = trade.tradeType === 'BUY'
            ? totalNoOfShares + trade.count
            : totalNoOfShares - trade.count;
    }

    return totalNoOfShares;
};


var getAverageOfAllBuys = function (array) {

    var totalSharesBought = 0;
    var totalValueInBoughtShares = 0;

    for (var i in array) {

        var trade = array[i];

        if (trade.tradeType === 'BUY') {

            totalSharesBought += trade.count;
            totalValueInBoughtShares += trade.count * trade.price;
        }
    }

    return totalValueInBoughtShares / totalSharesBought;
};

var response = ""

function scratch() {

    var result = {};

    for (var key in grouped) {
        if (grouped.hasOwnProperty(key)) {

            var array = grouped[key];

            var totalHoldingShares = getHoldingShares(array);

            var avgOfAllBuys = getAverageOfAllBuys(array);

            result[key] = {
                count: totalHoldingShares,
                avgPrice: avgOfAllBuys
            }
        }
    }

    console.log(result);
}

function keys(cb) {

    var portfolioValue = calculatePortfolioValue(grouped);
    var stocksInPortfolio = Object.keys(grouped); // Array of symbols of stocks present in portfolio;
    var url = getStocksPriceUrl(stocksInPortfolio); //Url to fetch latest stock prices

    request(url, function (err, response, stockPrices) {

        stockPrices = JSON.parse(stockPrices.slice(4, stockPrices.length));

        if (err) return cb(err);

        var currentPortfolioValue = 0;

        for (var i in stocksInPortfolio) {

            var totalShares = getTotalShares(grouped[stocksInPortfolio[i]]);
            var latestStockPrice = extractLatestStockPrice(stocksInPortfolio[i], stockPrices);

            currentPortfolioValue += totalShares * latestStockPrice;
        }

        var cumulativeReturn = (currentPortfolioValue - portfolioValue) / portfolioValue;

        cb(null, cumulativeReturn);
    });
}

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

function extractLatestStockPrice(stockSymbol, stockPrices) {
    for (var i in stockPrices) {
        if (stockPrices[i].t === stockSymbol) {
            return parseFloat(stockPrices[i].l);
        }
    }
}

function getStocksPriceUrl(stocksInPortfolio) {
    var url = "http://finance.google.com/finance/info?client=ig&q=";

    for (var i in stocksInPortfolio) {
        url += "NSE:" + stocksInPortfolio[i] + ",";
    }

    url = url.slice(0, url.length - 1);
    return url;
}

keys(function (err, result) {
    console.log(result);
});
