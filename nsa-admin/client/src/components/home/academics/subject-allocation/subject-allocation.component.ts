/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {Constants, ServiceUrls} from "../../../../common/index";

import {AssociateSubjectsComponent} from "../../../index";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'subject-allocation.html'
})
export class SubjectAllocationComponent implements OnInit {
    @ViewChild(AssociateSubjectsComponent) associateSubjectsComponent: AssociateSubjectsComponent
    @ViewChild('selectAll') selectAll:ElementRef;
    @ViewChild('singleClass') singleClass: ElementRef
    @ViewChild('singleSubject') singleSubject: ElementRef
    @ViewChild('singleSection') singleSection: ElementRef

    /* private selectedOptions: number[];*/
    classId: any;
    filterForm: any;
    sections: any;
    subjectArr:any[];
    modalId:any;
    value: any;
    hash:any[];
    data:any[] = [];
    classes:any[];
    userType:any[];
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls:ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Subject Allocation')
        this.baseService.enableAppJs();
        this.baseService.selectStyle()
        this.baseService.enableDataTable(this.serviceUrls.getSchoolClassSubject);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.SUBJECT_ALLOC_PERMISSIONS);
    }

    associateSubject(event: any){
        this.associateSubjectsComponent.openOverlay(event);
    }

    requested_delete(event:any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.deleteSchoolClassSubjects + JSON.parse(value).subjectId, value, 'datatable-allocation-export')
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-allocation-export');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

}
