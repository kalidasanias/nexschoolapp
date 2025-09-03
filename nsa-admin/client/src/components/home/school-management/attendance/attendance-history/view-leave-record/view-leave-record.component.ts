/**
 * Created by Cyril on 3/14/2017.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {ServiceUrls} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";

@Component({
    selector: 'leave-record',
    templateUrl: 'view-leave-record.html'
})

export class ViewLeaveRecordComponent implements OnInit {

    modalId: any;
    attendance: any;
    attendanceType: any;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
    }

    show() {
        this.baseService.openModal('viewAttendance');
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#viewAttendance')
    }

    getStudentLeaveHistory(event: any){
        this.modalId = event;
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getStudentLeaveHistory + event.target.value);
        this.baseService.dataTableDestroy('datatable-attendance-view');
        this.commonService.get(this.serviceUrls.getStudentLeaveHistory + event.target.value).then(
            attendance => this.callBack(attendance)
        );
    }

    callBack(value: any) {
        this.attendance = value;
        this.baseService.openOverlay(this.modalId);
    }

}