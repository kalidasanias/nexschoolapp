/**
 * Created by senthil on 3/21/2017.
 */

exports.checkResult = function(req, res, next) {
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            res.status(400).send({success: false, data: result.mapped()});
        } else {
            next()
        }
    });
};