
var expect = require('chai').expect;

var Trade = require('../../server/api/trade/trade.model');

describe('Trade', function () {

    it('should be invalid if tradeType is absent', function (done) {

        var trade = new Trade({
            price: 2.3,
            stock: "41224d776a326fb40f000001"
        });

        trade.validate(function (err) {
            expect(err.errors.tradeType).to.exist;
            done();
        });
    });

    it('should be invalid if tradeType is not a valid enum', function (done) {

        var trade = new Trade({
            tradeType: 'ABC',
            price: 2.3,
            stock: "41224d776a326fb40f000001"
        });

        trade.validate(function (err) {
            expect(err.errors.tradeType).to.exist;
            done();
        });
    });

    it('should be invalid if price is absent', function (done) {

        var trade = new Trade({
            tradeType: 'BUY',
            stock: "41224d776a326fb40f000001"
        });

        trade.validate(function (err) {
            expect(err.errors.price).to.exist;
            done();
        });
    });

    it('should be invalid if price is invalid', function (done) {

        var trade = new Trade({
            tradeType: 'BUY',
            stock: "41224d776a326fb40f000001",
            price: -3
        });

        trade.validate(function (err) {
            expect(err.errors.price).to.exist;
            done();
        });
    });

    it('should be invalid if stock is absent', function (done) {

        var trade = new Trade({
            tradeType: 'BUY',
            price: 2.3
        });

        trade.validate(function (err) {
            expect(err.errors.stock).to.exist;
            done();
        });
    });

    it('should be valid for a valid tradeType, price and stock', function (done) {

        var trade = new Trade({
            tradeType: 'BUY',
            price: 2.3,
            stock: "41224d776a326fb40f000001"
        });

        trade.validate(function (err) {
            expect(err).to.null;
            done();
        });
    });
})
