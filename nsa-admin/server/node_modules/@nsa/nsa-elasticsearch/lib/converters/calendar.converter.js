/**
 * Created by Kiranmai A on 4/29/2017.
 */

exports.convertCalObj = function(data) {
    var calObjs = [];
    try {
        var myarr = data.hits.hits;
        if(myarr.length > 0) {
            myarr.forEach(function (calendarObj) {
                var calObj = {};
                calObj = calendarObj._source;
                calObjs.push(calObj);
            });
        }
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return calObjs;
};
