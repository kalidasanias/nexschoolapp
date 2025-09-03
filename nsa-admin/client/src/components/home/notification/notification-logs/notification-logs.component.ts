/**
 * Created by senthil on 08/07/17.
 */
import { Component, OnInit, ViewChild }    from '@angular/core';
import { BaseService } from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls} from "../../../../common/constants/service.urls";
import {Constants} from "../../../../common/index";

import {HelpTextComponent} from "../../common/helptext/helptext.component";
declare var jQuery: any;
@Component({
    selector: 'notification-logs',
    templateUrl: 'notification-logs.html'
})
export class NotificationLogsComponent implements OnInit {
    event: any
    object: any
    statusEvent: any
    statusObject: any
    notificationLogs: any

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {

    }

    openOverlay(event: any) {
        this.baseService.openOverlay(event)
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#notificationLog')
    }

    getNotificationLogsByObj(event: any) {
        this.event = event;
        this.object = JSON.parse(event.target.value)
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getNotificaionLogsByObject + this.object.id)
        this.openOverlay(this.event)
    }

    getNotificationLogsById(event: any, id: any) {
        this.event = event;
        this.object = JSON.parse(event.target.value)
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getNotificaionLogsByObject + id)
        this.openOverlay(this.event)
    }

    callbackNotificationLogsByObj(logs: any) {
        this.notificationLogs = logs
        this.openOverlay(this.event)
    }

    getStatus(event: any) {
        this.statusObject = JSON.parse(event.target.value);
        if(this.statusObject.sms_response){
            var smsResponse = JSON.parse(this.statusObject.sms_response)
            if(smsResponse) {
                this.commonService.get(this.serviceUrls.checkStatusUrl + smsResponse.id).then(status => this.callBackStatus(status))
            }
        }else {
            this.baseService.showNotification(this.constants.smsOutOfDate,"","bg-danger")
        }
    }

    callBackStatus(status: any) {
        var data = status.data[0];
        var id = this.statusObject.id
        var content = '<table class="table"> <thead><tr><th>Mobile Number</th><th>Status</th><th>Sent Time</th><th>Delivered Time</th></tr></thead><tbody><tr><td>'+data.mobile+'</td><td>'+data.status+'</td><td>'+data.senttime+'</td><td>'+data.dlrtime+'</td></tr></tbody></table>'
        this.baseService.enablePopOver('#' + id, 'Notification Status', content, 'left')
    }
}