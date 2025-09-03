/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls, Constants} from "../../../../common/index";
import {AspectsComponent} from "./aspects/aspects.component";
import {SchoolSubjectsComponent} from "./school-subjects/school-subjects.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'subject-list.html',
})
export class SubjectListComponent implements OnInit {
    @ViewChild(AspectsComponent) aspectsComponent : AspectsComponent;
    @ViewChild(SchoolSubjectsComponent) schoolSubjectsComponent :SchoolSubjectsComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Subjects');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.addAspects();
        //this.baseService.enableSelect();
        this.baseService.enableDataTable(this.serviceUrls.getSchoolSubjects);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.SUBJECT_PERMISSIONS);
    }

    schoolSubjectShow(event: any) {
        this.schoolSubjectsComponent.openOverlay(event)
    }

    openOverlay(event: any) {
        this.aspectsComponent.openOverlay(event);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        if(!this.baseService.isEmptyObject(value)) {
            this.commonService.deleteObject(this.serviceUrls.deleteSchoolSubject + JSON.parse(value).subjectId, value, 'datatable-listsubjects');
            this.reload();
        }
    }

    editSubject(event: any) {
        this.schoolSubjectsComponent.getEditSubject(event);
    }

    reload() {
        this.baseService.dataTableReload('datatable-listsubjects');
    }

    requested_warning() {
        this.baseService.showWarning();
    }
}
