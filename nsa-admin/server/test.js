/**
 * Created by senthil on 02/08/17.
 */
var async = require('async')
var createUser = function(id, callback) {
    callback(null, {
        id: 'user' + id
    });
};

// generate 5 users
async.times(5, function(n, next) {
    console.log(n)
    createUser(n, function(err, user) {
        next(err, user);
    });
}, function(err, users) {
    console.log(users)
    // we should now have 5 users
});