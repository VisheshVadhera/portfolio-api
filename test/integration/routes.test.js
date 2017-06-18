
var supertest = require('supertest');
var app = require('../../server/app');

describe('Testing portfolio endpoints', function () {

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

    /*it('Delete successfully', function (done) {

        supertest(app)
            .post('/api/portfolio/removeTrade/')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {

                if (err) return done(err);

                console.log(res.body);
                done();
            })

    });*/

    /*it('Successful addition of the trade', function (done){

        supertest(app)
            .post('/api/portfolio/addTrade')
            .send({
                tradeType: "BUY",
                count: 100,
                price: 1500,
                stock: {
                    name: "HDFC"
                }
            })
            .expect(200)
            .end(function (err, res){

                if(err) return done(err);

                done();
            });

    });*/

    it('Successfully updating the trade', function (done){

        supertest(app)
            .post('/api/portfolio/updateTrade')
            .send({
                _id: "594609bbbd7e4175b7e85cc7",
                tradeType: "BUY",
                price: 1640,
                count: 100
            })
            .expect(200)
            .end(function (err, res){

                if(err) return done(err);

                console.log(res);
                done();
            });
    })

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
