/**
 * Created by vishesh on 16/6/17.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PortfolioSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    trades: [{
        type: Schema.Types.ObjectId,
        ref: 'Trade'
    }],
    __v: {
        type: Number,
        select: false
    }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
