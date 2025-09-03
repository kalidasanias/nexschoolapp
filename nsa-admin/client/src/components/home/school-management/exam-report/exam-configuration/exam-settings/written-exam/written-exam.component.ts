/**
 * Created by maggi on 07/05/17.
 */
import {Component, OnInit, forwardRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ServiceUrls, Constants, Messages } from '../../../../../../../common/index';
import { BaseService } from '../../../../../../../services/index';
import { AddExamComponent } from './add-writtenexam/add-exam.component'
import {CommonService} from "../../../../../../../services/common/common.service";

@Component({
    selector : 'written_examination',
    templateUrl: 'written-exam.html'
})
export class WrittenExamComponent implements OnInit {

    @ViewChild(AddExamComponent) addExamComponent: AddExamComponent;

    enableAdd: boolean = false;
    constructor(private constants: Constants,
                private messages: Messages,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private baseService: BaseService) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Examination Schedule');
        this.baseService.enableDataTable(this.serviceUrls.examType);
        this.enableAdd = this.baseService.havePermissionsToEdit(this.constants.EXAM_TYPE_PERMISSIONS);
    }

    addWrittenExam(event: any) {
        this.addExamComponent.show(event, 'Save', null);
    }

    editWrittenExam(event: any) {
        this.addExamComponent.show(event, 'Update', event.target.value);
    }

    deleteExamType() {
        this.baseService.showWarning();
    }

    confirmDelete(event: any) {
        if (event.target.value !== '') {
            this.commonService.deleteObj(this.serviceUrls.examType + event.target.value, 'datatable-exam-type');
        }
    }
}