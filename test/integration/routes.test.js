var supertest = require('supertest');
var app = require('../../server/app');

describe('Testing portfolio endpoints', function () {

    it('Get the portfolio', function (done) {

        supertest(app)
            .get('/api/portfolio')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {

                if (err) return done(err);

                done();
            })
    });

    it('Delete a trade successfully', function (done) {

        supertest(app)
            .post('/api/portfolio/removeTrade/<id>')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {

                if (err) return done(err);

                done();
            })

    });

    it('Add a trade to the portfolio', function (done) {

        supertest(app)
            .post('/api/portfolio/addTrade')
            .send({
                tradeType: "BUY",
                count: 100,
                price: 1500,
                stock: {
                    name: "HDFC Bank",
                    symbol: "HDFC"
                }
            })
            .expect(200)
            .end(function (err, res) {

                if (err) return done(err);

                done();
            });

    });

    it('Update the trade', function (done) {

        supertest(app)
            .post('/api/portfolio/updateTrade')
            .send({
                _id: "<id>",
                tradeType: "BUY",
                price: 1640,
                count: 100
            })
            .expect(200)
            .end(function (err, res) {

                if (err) return done(err);

                done();
            });
    })

    it('Get returns', function (done) {

        supertest(app)
            .get('/api/portfolio/returns')
            .set('Accept', 'application/json')
            .end(function (err, res) {

                if (err) return done(err);

                done();
            });

    });

    it('Get Holdings', function (done) {

        supertest(app)
            .get('/api/portfolio/holdings')
            .set('Accept', 'application/json')
            .end(function (err, res) {

                if (err) return done(err);

                done();
            });

    });

});
