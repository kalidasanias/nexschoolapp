import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";
declare var _ :any;

@Component({
    selector: 'view-promoted-stud',
    templateUrl: 'view-promoted-students.html'
})
export class ViewPromotedStudentsComponent implements OnInit {


    assignedUsers: any
    feeTypesDetails: any
    feeTypes: any
    totalFeeAmount: any
    feeAssignmentForm: any
    dueDate: any;
    assignees: any;
    refundAmount: any;
    feature:any[];
    academicYear: any
    newAcademicYear: any;
    currentClass: any;
    promotedClass: any;
    secList: any;
    academicYears: any[] = [];
    cAcademicYear: any;
    nAcademicYear: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) { }

    ngOnInit() {
    }


    openOverlay(event:any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#viewStudents');
    }

    getStudentDetails(event: any, academicYears: any) {
        var studnets = JSON.parse(event.target.value);
        this.academicYears = academicYears;
        this.cAcademicYear = (this.academicYears.length >= 1) ? this.academicYears[1].academicYear : this.constants.cAcademicYear;
        this.nAcademicYear = (this.academicYears.length > 0) ? this.academicYears[0].academicYear : this.constants.nAcademicYear;
        this.commonService.get(this.serviceUrls.getPromotionsSec + studnets.promoted_class_id + '/'+ this.nAcademicYear).then(
            sections => this.callBackSec(sections, studnets, event)
        )

    }

    callBackSec(sections: any, studnets: any, event: any) {
        this.secList = (_.map(sections, 'section_name')).toString();
        if(studnets) {
            this.promotedClass = studnets.promoted_class_name;
            this.currentClass = studnets.class_name;
            this.academicYear = studnets.academic_year;
            this.newAcademicYear = studnets.new_academic_year;
        }
        this.baseService.dataTableDestroy('datatable-student-list');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getPromoteStudents + this.nAcademicYear +'/' + studnets.promoted_class_id);
        this.openOverlay(event);

    }

}