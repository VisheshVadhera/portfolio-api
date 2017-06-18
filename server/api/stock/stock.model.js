
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var findOrCreate = require('mongoose-findorcreate');

var StockSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 1
    },
    symbol: {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    __v: {
        type: Number,
        select: false
    }
});

StockSchema.plugin(findOrCreate);

module.exports = mongoose.model('Stock', StockSchema);