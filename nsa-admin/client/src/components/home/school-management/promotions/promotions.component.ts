/**
 * Created by Sai Deepak on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {CommonService} from "../../../../services/common/common.service";
import {PromoteStudentComponent} from "./promote-students/promote-students.component";
import {ViewPromotedStudentsComponent} from "./view-promoted-students/view-promoted-students.component";
import {DepromotedStudentsComponent} from "./depromoted-students/depromote-students.component";
import {PromoteStudentReportComponent} from "./promote-student-report/promote-student-report.component";
declare  var $ : any

@Component({
    templateUrl: 'promotions.html'
})
export class PromotionsComponent implements OnInit {

    classes: any;
    academicYears: any;
    currentAcademicyear: any;
    oAcademicyear: any;
    enable: any;
    cyear: any;
    currentYear: any;
    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants,
                private messages: Messages) { }

    ngOnInit() {
        this.getActiveClasses();
        this.getAcademicYears();
        this.baseService.setTitle('NSA - Students Promotion');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.enable = this.baseService.havePermissionsToEditPromotions(this.constants.STUDENT_PROMOTIONS_PERMISSIONS);
    }
    @ViewChild(PromoteStudentComponent) promoteStudentComponent: PromoteStudentComponent;
    @ViewChild(ViewPromotedStudentsComponent) viewComponent: ViewPromotedStudentsComponent;
    @ViewChild(DepromotedStudentsComponent) depromotedStudComponent: DepromotedStudentsComponent;
    @ViewChild(PromoteStudentReportComponent) reportComponent: PromoteStudentReportComponent;

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
    }

    getAcademicYears() {
        this.commonService.get(this.serviceUrls.getAcademicYears).then(
            classes => this.callBackYears(classes)
        )
    }

    callBackYears(data: any) {
        this.academicYears = data;
        this.currentAcademicyear = (data) ? data[0].academicYear : "2018-2019";
        this.oAcademicyear = (data.length > 0) ? data[1].academicYear : "2017-2018";
        this.cyear = this.baseService.getAcademicYear();
        if(this.cyear != this.currentAcademicyear) {
            this.baseService.destroyDatatable('.datatable-promotions');
            this.baseService.enableDataTable(this.serviceUrls.promotedClass + this.oAcademicyear + '/' + this.currentAcademicyear);
        } else {
            this.baseService.enableDataTable(this.serviceUrls.promotedClass + "12" + '/' + "12");
        }

    }

    reportStudent(event :any) {

        this.promoteStudentComponent.openOverlay(event, this.classes, this.academicYears)
        /*this.currentYear = this.baseService.isCurrentYear();
        if((this.cyear == this.currentAcademicyear) || (this.currentYear)) {
            this.baseService.showNotification(this.constants.promotionValidation, "", "bg-danger");
        } else {
            this.promoteStudentComponent.openOverlay(event, this.classes, this.academicYears)
        }*/

    }

    studentViewData(event: any) {
        this.viewComponent.getStudentDetails(event, this.academicYears);
    }

    dePromoteStudnets(event: any) {
        this.depromotedStudComponent.getStudentDetails(event, this.classes, this.academicYears);
    }

    reportData(event: any) {
        this.reportComponent.openOverlay(event, this.classes, this.academicYears);
        /*if(this.cyear == this.currentAcademicyear) {
            this.baseService.showNotification(this.constants.promotionReportValidation, "", "bg-danger");
        } else {
            this.reportComponent.openOverlay(event, this.classes, this.academicYears);
        }*/

    }

}
