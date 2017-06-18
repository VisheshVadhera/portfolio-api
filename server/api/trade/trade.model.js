
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Portfolio = require('../portfolio/portfolio.model');

var TradeSchema = new Schema({
    tradeType: {
        type: String,
        enum: ['SELL', 'BUY'],
        required: true
    },
    count:{
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    portfolio: {
        type: Schema.Types.ObjectId,
        ref: 'Portfolio'
    },
    __v: {
        type: Number,
        select: false
    }
});

TradeSchema.pre('remove', function (next) {
    Portfolio.update({
            name: "sample"
        },
        {
            $pull: {
                trades: this._id
            }
        })
        .exec();
    next();
});

module.exports = mongoose.model('Trade', TradeSchema);
