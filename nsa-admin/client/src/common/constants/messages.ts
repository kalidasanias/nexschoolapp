/**
 * Created by SenthilPeriyasamy on 10/28/2016.
 */
'use strict';
import { Injectable } from '@angular/core';

Injectable()
export class Messages {

    /*For Login*/
    login_success = 'You are Successfully Logged in';
    logout_success = 'You are Logged Out Successfully!';
    change_pwd_success = 'Password Successfully Changed';
    change_pwd_error = 'Password Change Error';

    /*For Notification*/
    notifi_success = 'Notification Successfully Deleted!';
    message_notifi_deleted_success = 'Your message has been deleted.'
    notifi_err = 'An Error Occur while Deleting the Notification !';
    delete_success = 'Deleted Succesfully!'
    update_success = 'User Status Updated Succesfully'
	subjectAlloc_delete_success = 'Subject Allocation deleted'
    assignment_delete_success = 'Assignment type deleted'
    scholarship_delete_success = 'Scholarship details deleted'
    feeStructure_delete_success = 'Fee structure deleted'
    specTimetable_delete_success = 'Special Day Timetable deleted'
    delete_err = 'An Error Occur while Deteting !!'
    NoSubjectAssociation = 'No subjects associated for this class and section'
    noFiles = 'There is no Files to '
}