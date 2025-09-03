 /**
 * Created by senthilPeriyasamy on 12/27/2016.
 */
var dateFormat = require('dateformat');

exports.getFormattedDate = function(date) {
    var formattedDate = dateFormat(date, "mmm d yyyy h:MM TT");
    return formattedDate;
};

 exports.getCassandraFormattedDate = function(date) {
     var formattedDate = dateFormat(date, "yyyy-mm-dd HH:mm:ssZ");
     return formattedDate;
 };

 exports.getFormattedDateWithDay = function(date) {
     var formattedDate = dateFormat(date, "ddd mmm d");
     return formattedDate;
 };
 exports.getServerDate = function(date){
     var formattedDate = dateFormat(date, "yyyy-mm-dd");
     var isoDate = new Date(formattedDate).toISOString();
     return isoDate;
 };

 exports.getFormattedDateWithoutTime = function(date){
     var formattedDate = dateFormat(date, "yyyy-mm-dd");
     return formattedDate;
 }