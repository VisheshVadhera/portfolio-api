/**
 * Created by vishesh on 17/6/17.
 */

var supertest = require('supertest');
var app = require('../../server/app');

describe('Testing GET /portfolio ', function () {

    /*it('Should respond with a 200', function (done) {

        supertest(app)
            .get('/api/portfolio')
     .set('Accept', 'application/json')
            .end(function (err, res) {

                if (err) return done(err);

                console.log(res.body);
                done();
            })
    });*/

    it('Delete successfully', function (done) {

        supertest(app)
            .post('/api/portfolio/removeTrade/594609bbbd7e4175b7e85ccd')
            .set('Accept', 'application/json')
            .end(function (err, res) {

                if (err) return done(err);

                console.log(res.body);
                done();
            })

    });

    /*it('Successful addition of the trade', function (done){

        supertest(app)
            .post('/api/portfolio/addTrade')
            .send({
                tradeType: "BUY",
                stock: {
                    name: "Facebook",
                    symbol: "FACEBK",
                    price: 15.6
                }
            })
            .expect(200)
            .end(function (err, res){

                if(err) return done(err);

                console.log(res);
                done();
            });

    });*/

    /*it('Successfully updating the trade', function (done){

        supertest(app)
            .post('/api/portfolio/updateTrade')
            .send({
                _id: "5944fe206f338315e6e3bae4",
                tradeType: "BUY",
                price: 13.4
            })
            .expect(200)
            .end(function (err, res){

                if(err) return done(err);

                console.log(res);
                done();
            });
    })*/

    /*it('Successfully get returns', function (done){

        supertest(app)
            .get('/api/portfolio/returns')
            .set('Accept', 'application/json')
            .end(function(err, res){

                if(err) return done(err);

                done();
            });

    });*/
});
