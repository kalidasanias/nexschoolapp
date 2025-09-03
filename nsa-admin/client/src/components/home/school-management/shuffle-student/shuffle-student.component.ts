/**
 * Created by Sai Deepak on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {CommonService} from "../../../../services/common/common.service";
import {AddShuffleStudentComponent} from "./add-shuffle-students/add-shuffle-students.component";
declare  var $ : any

@Component({
    templateUrl: 'shuffle-student.html'
})
export class ShuffleStudentsComponent implements OnInit {

    classes: any;
    academicYears: any;
    currentAcademicyear: any;
    oAcademicyear: any;
    enable: any;
    cyear: any;
    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants,
                private messages: Messages) { }

    ngOnInit() {
        this.getActiveClasses();
        this.getAcademicYears();
        this.baseService.setTitle('NSA - Shuffle Students')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.enable = this.baseService.havePermissionsToEditPromotions(this.constants.SHUFFLE_STUDENT_PERMISSIONS);
    }
    @ViewChild(AddShuffleStudentComponent) shuffleStudentComponent: AddShuffleStudentComponent;

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
            this.baseService.destroyDatatable('.datatable-shuffle');
            this.baseService.enableDataTable(this.serviceUrls.promotedClass + this.oAcademicyear + '/' + this.currentAcademicyear);
        } else {
            this.baseService.enableDataTable(this.serviceUrls.promotedClass + "12" + '/' + "12");
        }
    }


    shuffleStudents(event: any) {
        var classData = JSON.parse(event.target.value)
        $('#Shuffle').attr('data-title', 'Shuffle Students - ' + classData.promoted_class_name + ' - ' + this.currentAcademicyear);
        this.shuffleStudentComponent.openOverlay(event, this.classes, this.academicYears, classData.promoted_class_id);

    }

}
