/**
 * Created by maggi on 24/05/17.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../../services/base/base.service";
import {ServiceUrls} from "../../../../../../../common/constants/service.urls";
import {ProgressCardStatistics} from "./progress-card-statistics/progress-card-statistics.component";
import {MarkUploadConfigComponent} from "./mark-upload-config/mark-upload-config.component";
import {CommonService} from "../../../../../../../services/common/common.service";
import {Constants} from "../../../../../../../common/constants/constants";
import {NotificationLogsComponent} from "../../../../../notification/notification-logs/notification-logs.component";
import {MarklistUploadComponent} from "./marklist-upload/marklist-upload.component";
import {PrintProgressCardComponent} from "./print-progress-card/print-progress-card.component";

@Component({
    selector : 'mark-upload',
    templateUrl: 'mark-upload.html'
})

export class MarkUploadComponent implements OnInit {

    @ViewChild(ProgressCardStatistics) progressCardStatistics: ProgressCardStatistics
    @ViewChild(MarkUploadConfigComponent) markUploadConfigComponent: MarkUploadConfigComponent
    @ViewChild(NotificationLogsComponent) notificationLogsComponent: NotificationLogsComponent;
    @ViewChild(MarklistUploadComponent) marklistUploadComponent: MarklistUploadComponent;
    @ViewChild(PrintProgressCardComponent) printProgressCardComponent: PrintProgressCardComponent;

    enable: boolean = false;

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private constants: Constants,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Written Exams');
        this.enable = this.baseService.havePermissionsToEdit(this.constants.MARKS_UPLOAD_PERMISSIONS);
        this.baseService.enableDataTable(this.serviceUrls.getMarkList);
    }

    viewStatistics(event: any) {
        this.progressCardStatistics.show(event)
    }

    addMarkUploadConfig(event: any) {
        this.markUploadConfigComponent.show(event)
    }

    editMarkSheet(event: any) {
        this.markUploadConfigComponent.editMarkSheet(event)
    }

    publishMarkSheet(event: any) {
        this.markUploadConfigComponent.publishMarkSheet(event)
    }

    addMarklistUploadConfig(event: any){
        this.marklistUploadComponent.show(event)
    }

    progressCardPrint(event: any){
        this.printProgressCardComponent.show(event)
    }

    reRender(classId: any, sectionId: any, examId: any) {
        this.baseService.destroyDatatable('.exam-details')
        this.baseService.enableDataTable(this.serviceUrls.getMarkList + '?classId=' + classId + '&sectionId=' + sectionId + '&id=' + examId);
    }

    requested_warning(event: any) {
        this.baseService.showWarning();
    }

    requested_delete(event: any) {
        if(event.target.value) {
            var obj = JSON.parse(event.target.value);
            if(obj['marklistId']) {
                this.commonService.deleteObj(this.serviceUrls.deleteMark + obj['marklistId'], 'exam-details');
            }
        }
    }

    getNotificationLog(event: any) {
        var obj = JSON.parse(event.target.value)
        this.notificationLogsComponent.getNotificationLogsById(event, obj['marklistId'])
    }

}
