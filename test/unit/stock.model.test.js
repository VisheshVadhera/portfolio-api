/**
 * Created by vishesh on 17/6/17.
 */

var expect = require('chai').expect;

var Stock = require('../../server/api/stock/stock.model');

describe('Stock', function () {

    it('should be invalid if name is absent', function (done) {

        var stock = new Stock({symbol: "AAPL"});

        stock.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if name is empty string', function (done) {

        var stock = new Stock({name: '', symbol: "AAPL"});

        stock.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if name is more than 50 chars long', function (done) {

        var stock = new Stock({
            name: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz',
            symbol: "AAPL"
        });

        stock.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if symbol is absent', function (done) {

        var stock = new Stock({name: "abc"});

        stock.validate(function (err) {
            expect(err.errors.symbol).to.exist;
            done();
        });
    })

    it('should be invalid if symbol is an empty string', function (done) {

        var stock = new Stock({
            name: "abc",
            symbol: ''
        });

        stock.validate(function (err) {
            expect(err.errors.symbol).to.exist;
            done();
        });
    })

    it('should be invalid if symbol is more than 20 chars long', function (done) {

        var stock = new Stock({
            name: "abc",
            symbol: 'abcdefghijklmnopqrstuvwxyz'
        });

        stock.validate(function (err) {
            expect(err.errors.symbol).to.exist;
            done();
        });

    });


    it('should be valid for a valid name and symbol', function (done) {

        var stock = new Stock({
            name: "abc",
            symbol: 'abc'
        });

        stock.validate(function (err) {
            expect(err).to.null;
            done();
        });

    });

});