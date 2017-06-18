
var expect = require('chai').expect;

var Portfolio = require('../../server/api/portfolio/portfolio.model');

describe('Portfolio', function () {

    it('should be invalid if name is absent', function (done) {

         var portfolio = new Portfolio({
            trade: "41224d776a326fb40f000001"
         });

         portfolio.validate(function (err){
             expect(err.errors.name).to.exist;
             done();
         });
    });

    it('should be invalid if name is empty', function (done) {

        var portfolio = new Portfolio({
            name: "",
            trade: "41224d776a326fb40f000001"
        });

        portfolio.validate(function (err){
            expect(err.errors.name).to.exist;
            done();
        });
    });
})