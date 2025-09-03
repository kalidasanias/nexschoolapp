/**
 * Created by maggi on 24/05/17.
 */
import {Component, OnInit, ElementRef, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../services/base/base.service";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../../services/common/common.service";
import {Constants} from "../../../../../../common/constants/constants";
import {MarkUploadComponent} from "./mark-upload/mark-upload.component";

@Component({
    templateUrl: 'progresscard-generation.html'
})

export class ProgressCardGenerationComponent implements OnInit {

    classId: any
    sectionId: any
    examId: any

    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChild('sectionSelect') sectionSelect: ElementRef;
    @ViewChild('examSelect') examSelect: ElementRef;

    @ViewChild(MarkUploadComponent) markUploadComponent: MarkUploadComponent

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.setTitle('NSA - Progress Card Generation');
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            result => this.classCallback(result, false),
            error => this.classCallback(<any>error, true))
    }

    classCallback(result: any, err: any) {
        this.baseService.enableSelectWithEmpty('#class-select', result, this.constants.classObj, null);
    }

    getSectionByClass() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.sectionId = '';
        this.examId = '';
        this.markUploadComponent.reRender(this.classId, this.sectionId, this.examId)
        if(this.classId.length > 0) {
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then( sections => this.callBackSections(sections))
            this.baseService.removeHideClass('#section-select');
        } else {
            this.baseService.addHideClass('#section-select');
        }
    }

    getMarkListByClassAndSections() {
        this.examId = this.baseService.extractOptions(this.examSelect.nativeElement.selectedOptions)[0].id;
        this.markUploadComponent.reRender(this.classId, this.sectionId, this.examId)
    }

    callBackSections(result: any) {
        this.baseService.enableSelectWithEmpty('#section-select', result, this.constants.sectionObj, null);
    }

    getExamsByClassAndSections() {
        this.sectionId = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0].id;
        this.examId = '';
        this.markUploadComponent.reRender(this.classId, this.sectionId, this.examId)
        if(this.sectionId.length > 0) {
            this.commonService.get(this.serviceUrls.examScheduleByClassAndSection + this.classId + '/' + this.sectionId).then(
                result => this.categoryCallback(result, false),
                error => this.categoryCallback(<any>error, true))
        }
    }

    categoryCallback(result: any, err: any) {
        this.baseService.enableSelectWithEmpty('#exam-select', result, this.constants.examSchedule, null);
    }

}