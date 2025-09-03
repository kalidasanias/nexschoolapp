/**
 * Created by Sai Deepak on 15-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";
declare var jQuery: any;

@Component({
    selector: 'promote-student-report',
    templateUrl: 'promote-student-report.html'
})

export class PromoteStudentReportComponent implements OnInit {

    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChild('singleSection') singleSection: ElementRef;
    classes: any;
    sections: any;
    classId: any;
    currentDate: any;
    sectionId: any;
    dates: any;
    className: any;
    sectionName: any;
    constId: '00000000-0000-0000-0000-000000000000';
    feature:any[];
    data: any = {};
    classObj : any;
    secObj : any;
    academicYears: any[] = [];
    cAcademicYear: any;
    nAcademicYear: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        //this.getActiveClasses();
    }

    openOverlay(event:any, classes: any, academicYears: any) {
        this.academicYears = academicYears;
        this.cAcademicYear = (this.academicYears.length >= 1) ? this.academicYears[1].academicYear : this.constants.cAcademicYear;
        this.nAcademicYear = (this.academicYears.length > 0) ? this.academicYears[0].academicYear : this.constants.nAcademicYear;
        this.classes = classes;
        this.baseService.enableLoadingWithMsg('')
        this.resetForm();
        this.baseService.openOverlay(event);
        this.baseService.disableLoading()
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#report');

    }

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
        this.baseService.enableSelectWithEmpty('#report-class', this.classes, this.constants.classObj, null);
    }

    getSecByClass() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        if(this.classId.length < 1) {
            this.baseService.addHideClass('#sectionData');
        }  else {
            this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
            this.baseService.removeHideClass('#sectionLabel');
            this.baseService.removeHideClass('#sectionData');

            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then(
                sections => this.callBackSections(sections)
            )
        }
    }

    callBackSections(data: any) {
        this.sections = data;
        this.baseService.enableMultiSelectFilteringAll('#report-section', data, this.constants.sectionObj, null)
    }


    getStudData() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.className = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].name;
        var dataFound = this.setValidations();
        var dataObj: any = {};
        var clssObj: any  = {};
        clssObj.id = this.classId;
        clssObj.section = this.baseService.extractOptionValue(this.singleSection.nativeElement.selectedOptions);
        dataObj.classes = [clssObj];
        dataObj.promoted = true;
        dataObj.year = this.cAcademicYear;
        if(dataFound){
            this.sectionId = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].id;
            this.sectionName = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].name;
            this.baseService.dataTableDestroy('datatable-student-report');
            this.baseService.dataTableDestroy('datatable-depromote-list');
            this.baseService.enableDataTableAjax(this.serviceUrls.getPromoteStudents + 'report', dataObj);
            this.baseService.removeDisabled('#genPromoReport');
        }
    }

    save(id: any, event: any) {
        this.saveJson(id, event.target.value);
    }

    sectionChange() {
        this.resetSectionForm();
    }


    generateCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.rportData(result)
            this.baseService.disableBtnLoading(id);
        }
    }

    saveJson(id: any, values: any) {
        if(this.classId != undefined || this.classId != "") {
            var value = JSON.parse(values);
            if(value.length < 1) {
                this.baseService.showNotification("Select Student to generate report!", "", 'bg-danger');
            } else {
                this.baseService.enableBtnLoading(id);
                this.baseService.enableDivLoading('.generateReport', this.constants.getReady)
                this.data.users =  value;
                this.data.promotions = true;
                this.commonService.post(this.serviceUrls.student + 'report/class', this.data).then(
                    result => this.generateCallBack(result, id, false),
                    error => this.generateCallBack(<any>error, id, true))
            }

        } else {
            this.baseService.showNotification("submit class Details!", "", 'bg-danger');
        }
    }

    resetForm() {
        this.baseService.addDisabled('#saveAttendance');
        this.baseService.enableSelectWithEmpty('#report-class', this.classes, this.constants.classObj, null);
        this.baseService.addHideClass('#sections');
        this.baseService.addHideClass('#sectionLabel');
        this.baseService.addHideClass('.multiselect');
        this.resetSectionForm();
    }

    resetSectionForm() {
        this.baseService.dataTableDestroy('datatable-depromote-list');
        this.baseService.dataTableDestroy('datatable-student-report');
        var dataObj: any = {};
        var clssObj: any = {};
        clssObj['id'] = "00000000-0000-0000-0000-000000000000";
        clssObj.section = [];
        dataObj.classes = [clssObj];
        dataObj.promoted = true;
        dataObj.year = '2017-2018';
        this.baseService.enableDataTableAjax(this.serviceUrls.getPromoteStudents + 'report', dataObj);
    }

    setValidations() : any {
        var dataFound = false;
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        if(this.classId.length < 1) {
            this.baseService.showNotification("Enter Class Details", "", 'bg-danger');
        }  else {
            dataFound = true;
        }

        return dataFound;
    }
}