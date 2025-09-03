/**
 * Created by admin on 27/04/17.
 */

function getHeaders(req) {
    var headers = {user_id: req.headers.userInfo.user_name, user_name:req.headers.userInfo.first_name,
        user_type: req.headers.userInfo.user_type, tenant_id: req.headers.userInfo.tenant_id,
        school_id: req.headers.userInfo.school_id,
        school_name: req.headers.userInfo.school_name
    }

    return headers;
}

exports.getHeaders = getHeaders;


function getBucketName(req) {
    var headers = getHeaders(req)
    return headers.school_id;
}
exports.getBucketName = getBucketName;