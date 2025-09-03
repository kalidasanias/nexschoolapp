/**
 * Created by Cyril on 2/22/2017.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService } from '../../../../../../../services/index';
import { ServiceUrls, Constants, Messages } from '../../../../../../../common/index';
import {AddExamScheduleComponent} from "./add-examination/add-exam-schedule.component";
import {CommonService} from "../../../../../../../services/common/common.service";


@Component({
    selector : 'exam_schedule',
    templateUrl: 'exam-schedule.html'
})
export class ExamScheduleComponent implements OnInit {

    @ViewChild(AddExamScheduleComponent) addExamScheduleComponent: AddExamScheduleComponent;
    examTypes: any[];
    enableAdd: boolean = false;

    constructor(private constants: Constants,
                private messages: Messages,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private baseService: BaseService) { }

    ngOnInit() {
        this.baseService.enableDataTableAjax(this.serviceUrls.examSchedule, null);
        this.enableAdd = this.baseService.havePermissionsToEdit(this.constants.EXAM_SCHEDULE_PERMISSIONS);
    }

    addScheduleExam(event: any) {
        this.commonService.get(this.serviceUrls.examType).then(examTypes => this.callBackExamType(examTypes, event, null));
    }

    callBackExamType(examTypes: any, event: any, exam_id: string) {
        this.examTypes = examTypes;
        if (this.examTypes.length > 0) {
            this.addExamScheduleComponent.show(event, exam_id, this.examTypes);
        } else {
            this.baseService.showNotification('No Written Exam Type Created', '', 'bg-danger');
        }
    }

    editScheduleExam(event: any) {
        this.commonService.get(this.serviceUrls.examType).then(examTypes => this.callBackExamType(examTypes, event, event.target.value));
    }

    deleteExam() {
        this.baseService.showWarning();
    }

    confirmDelete(event: any) {
        if (event.target.value !== '') {
            this.commonService.deleteObj(this.serviceUrls.examSchedule + event.target.value, 'datatable-exam-schedule');
        }
    }

}
