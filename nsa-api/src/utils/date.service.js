/**
 * Created by senthilPeriyasamy on 12/27/2016.
 */
var dateFormat = require('dateformat');

exports.getFormattedDate = function(date) {
    var formattedDate = dateFormat(date, "mmm d yyyy h:MM TT");
    return formattedDate;
};