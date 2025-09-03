/**
 * Created by senthilPeriyasamy on 1/3/2017.
 */

module.exports = Object.freeze({

    /* HTTP Response Codes */
    HTTP_OK: 200,
    HTTP_CREATED: 201,
    HTTP_ACCEPTED: 202,
    HTTP_NON_AUThORITATIVE: 203,
    HTTP_NO_CONTENT: 202,

    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORIZED: 401,
    HTTP_PAYMENT_REQUIRED: 402,
    HTTP_FORBIDDEN: 403,
    HTTP_NOT_FOUND: 404,

    /* SMS */
    SMS_URL: 'http://alerts.valueleaf.com/api/v3/?method=sms.json&api_key=A0ad91a9c237d01dfaa7a86b9dc8a9b1f&format=json&json=' ,
    SMS_USER_NAME: 'nexrisetech',
    SMS_SENDER: 'NXRISE',
    SMS_SEC_KEY: '92bd7114f1d974a7',

    CONTENT_TYPE: 'application/json',

    METHOD_POST : 'POST',

    UPDATED_DATE: 'updated_date',

    /* ELASTIC SEARCH */
    INDEX_NAME: 'nsa',
    TYPE_NAME: 'users',
    ACADEMIC_YEAR: '2016-2017',

    //Status
    STATUS_ACTIVE: 'Active',
    STATUS_DEACTIVE: 'Inactive',

    //Status For Fee
    STATUS_PENDING: 'Pending',
    STATUS_PUBLISH: 'Publish',
    STATUS_PAID: 'Paid',
    STATUS_UNPAID: 'UnPaid'
});