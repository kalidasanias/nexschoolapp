import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";
declare var _: any;

@Component({
    selector: 'depromoted-stud',
    templateUrl: 'depromoted-students.html'
})
export class DepromotedStudentsComponent implements OnInit {


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
    classes: any;
    classObj: any;
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
        this.baseService.closeOverlay('#DepromteStudents');
    }

    getStudentDetails(event: any, classes: any, academicYears: any) {
        this.classes = classes;
        this.academicYears = academicYears;
        this.cAcademicYear = (this.academicYears.length >= 1) ? this.academicYears[1].academicYear : this.constants.cAcademicYear;
        this.nAcademicYear = (this.academicYears.length > 0) ? this.academicYears[0].academicYear : this.constants.nAcademicYear;
        var students = JSON.parse(event.target.value);
        this.commonService.get(this.serviceUrls.getPromotionsSec + students.promoted_class_id  + '/' + this.nAcademicYear).then(
            sections => this.callBackSections(sections, students, event)
        )
    }

    savePromoted(event :any) {
        var data = JSON.parse(event.target.value)
        this.commonService.put(this.serviceUrls.promoteStudents + 'promote/' + data.userName, data).then(
            result => this.saveCallBack(result, false),
            error => this.saveCallBack(<any>error, true)
        )
    }

    saveCallBack(result:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.dataTableReload('datatable-promotions');
            this.baseService.closeOverlay('#DepromteStudents');
        }
    }

    callBackSections(sections : any, students: any, event: any) {
        console.log("sections", sections);
        students.sections = sections;
        this.classObj = _.filter(this.classes, {"classId": students.promoted_class_id })
        students.classObj = this.classObj;
        this.baseService.dataTableDestroy('datatable-student-report');
        this.baseService.dataTableDestroy('datatable-depromote-list');
        this.baseService.enableDataTableAjax(this.serviceUrls.getPromoteStudents + 'depromote/' + this.cAcademicYear + '/' + students.class_id, students);
        this.openOverlay(event);
    }

}