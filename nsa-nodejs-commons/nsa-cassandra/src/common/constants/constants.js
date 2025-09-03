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
    SMS_URL: 'http://sms.hostmacro.com/sendsms/?' ,
    SMS_USER_NAME: 'nexrisetech',
    SMS_SENDER: 'NXRISE',
    SMS_SEC_KEY: '92bd7114f1d974a7',

    CONTENT_TYPE: 'application/json',

    METHOD_POST : 'POST',
    MESSAGE_DATE : 'message_date',

    UPDATED_DATE: 'updated_date',

    //Status
    STATUS_ACTIVE: 'Active',
    STATUS_INACTIVE: 'Inactive',
    STATUS_DRAFT: 'Draft',
    STATUS_SENT: 'Sent',
    STATUS_SUBMIT: 'Submitted',
    STATUS_NOT_SUBMIT: 'Not Submitted',
    STATUS_ACADEMIC: 'Academic',
    STATUS_NON_ACADEMIC: 'Non-Academic',

    //Status For Fee
    STATUS_PENDING: 'Pending',
    STATUS_PUBLISH: 'Published',
    STATUS_PAID: 'Paid',
    STATUS_UNPAID: 'UnPaid',

    //Taxanomy

    ALL_CLASSES_ID : '5010a262-e87d-11e6-bf01-fe55135034f3',
    ALL_CLASSES_CATEGORY_ID : '331dc52c-b36d-4c1b-a5ad-e2e402bfe485',
    TAXANOMY_ID: '60109d80-e87d-11e6-bf01-fe55135034f3',
    DEPT_TAXANOMY_ID: 'e3391463-6110-4324-a19f-43e4311835dc',
    ORDER_BY: 'order_by',
    PRIORITY: 'priority',
    NAV_PARENT_ID: '92585ffc-ee5a-49ad-951c-912fc3a87eff',

    ALL_EMPLOYEE : 'All Employee',
    ALL_CLASSES  : 'All Classes',

    MANAGE_ALL: 'manageAll',
    MANAGE: 'manage',
    VIEW_All: 'viewAll',
    VIEW: 'view',
   ACADEMIC_YEAR: '2017-2018'

});