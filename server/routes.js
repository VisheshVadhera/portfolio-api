/**
 * Created by vishesh on 14/6/17.
 */

module.exports = function(app) {
    app.use("/api/", require('./api/portfolio'));
};