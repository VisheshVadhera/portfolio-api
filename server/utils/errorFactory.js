/**
 * Created by vishesh on 18/6/17.
 */

module.exports.createError = function (message) {
    var err = {
        err: message
    }
    return err;
}