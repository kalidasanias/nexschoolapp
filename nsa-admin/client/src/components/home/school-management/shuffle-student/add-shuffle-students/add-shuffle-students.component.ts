/**
 * Created by Sai Deepak  on 05-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants} from "../../../../../common/constants/constants";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
import {WizardComponent} from "../../../../wizard/wizard.component";
import {CommonService} from "../../../../../services/common/common.service";
declare var $: any;
declare var _: any;

@Component({
    selector: 'add-shuffle-student',
    templateUrl: 'add-shuffle-students.html'
})

export class AddShuffleStudentComponent implements OnInit {

    @ViewChild(WizardComponent) wizardComponent: WizardComponent;
    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChild('singleSection') singleSection: ElementRef;
    @ViewChild('selecSection') selecSection: ElementRef;
    @ViewChild('sms') sms: ElementRef
    // @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef;

    classes: any;
    sections: any;
    classId: any;
    sectionId: any;
    className: any;
    sectionName: any;
    curSections: any
    users: any;
    studentData: any = {}
    postClass: any;
    mappedSections: any[] = [];
    finalData: any;
    allSections: any;
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
        this.getAllSections();
        this.getFeatureChannelConfiguration();
    }

    getAllSections() {
        this.commonService.get(this.serviceUrls.section).then(
            sections => this.callBackAllSections(sections)
        )
    }

    openOverlay(event:any, classes: any, academicYears: any, classId: any) {
        this.classes = classes;
        this.classId = classId
        this.resetForm();
        this.academicYears = academicYears;
        this.cAcademicYear = (this.academicYears.length >= 1) ? this.academicYears[1].academicYear : this.constants.cAcademicYear;
        this.nAcademicYear = (this.academicYears.length > 0) ? this.academicYears[0].academicYear : this.constants.nAcademicYear;
        this.getSectionByClass(classId, event);
        this.baseService.disableLoading()
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#shuffle_students');

    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    callBackAllSections(data: any) {
        this.allSections = data;
        this.baseService.enableSelectWithEmpty('#shuffle-all-section', data, this.constants.sectionObj, null);
    }

    getSectionByClass(classId: any, event: any) {
        this.baseService.addHideClass('.studnet-data');
        this.commonService.get(this.serviceUrls.getPromotionsSec + classId + '/' + this.nAcademicYear).then(
            sections => this.callBackSections(sections, event)
        )
    }

    callBackSections(data: any, event: any) {
        this.sections = data;
        this.baseService.enableMultiSelectFilteringAll('#shuffle-section', data, this.constants.sectionsObj, null);
        this.baseService.removeHideClass('.sectionsList');
        this.baseService.openOverlay(event);
    }


    getAttendanceData() {
        var dataFound = this.setValidations();
        var data = {};
        var classes = [];
        var classObj = {};
        if(dataFound){
            var classVal = _.filter(this.classes, {"classId" : this.classId});
            this.className = classVal ? classVal[0].className : "0";
            classObj['id'] = this.classId;
            classObj['section'] = this.baseService.extractOptionValue(this.singleSection.nativeElement.selectedOptions);
            classes.push(classObj);
            data['classes'] = classes;
            data['year'] = this.nAcademicYear;
            data['academicYear'] = this.nAcademicYear;
            data['shuffle'] = true;
            data['orderBy'] = classVal ? classVal[0].orderBy : "0";
            var url = this.serviceUrls.getPromoteStudents;
            this.commonService.post(url, data).then(students => this.callBackStudents(students));
        }
    }

    callBackStudents(students: any) {
        this.postClass = students.postClass;
        this.allSections = students.sections;
        this.users = students.users;
        var userData = {}
        userData['users'] = this.users;
        userData['newClass'] = this.postClass;
        setTimeout(() => {
            this.baseService.enableSourceDataTable(".datatable-shuffle-student-list", userData);
            this.baseService.removeDisabled('#shuffleListData');
            this.baseService.removeHideClass('.promotionDiv');
        }, 1000);
    }

    onSelection(event: any) {
        this.baseService.addClass('#classes', 'not-active');
        this.baseService.addClass('.sectionsList', 'not-active');
        this.baseService.addClass('#allsections', 'not-active');
        this.baseService.addHideClass('.submitClass');
        var sectionId = this.baseService.extractOptionValue(this.selecSection.nativeElement.selectedOptions);
        if(sectionId.length < 1) {
            this.baseService.showNotification("Select 'Move To' Section", "", 'bg-danger');
        } else {
            var sectionObj = _.filter(this.allSections, {"sectionId" : sectionId[0]});
            $('#updateSatus').val(JSON.stringify(sectionObj));
            $('#shuffleList').click();
        }

    }

    save(id: any) {
        var dataFound = this.saveValidation();
        if(dataFound) {
            this.commonService.post(this.serviceUrls.promoteStudents + 'shuffle', this.finalData).then(
                result => this.saveCallBack(result, id, false),
                error => this.saveCallBack(<any>error, id, true));
        }
    }

    renderSelected(event: any) {
        this.finalData = JSON.parse(event.target.value);
        this.baseService.enableSourceDataTable(".datatable-promote-final-list", this.finalData.oldUsers);
    }


    saveCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.dataTableReload('datatable-promotions');
            this.baseService.closeOverlay('#shuffle_students');
        }
    }

    sectionChange() {
        this.baseService.addHideClass('.promotionDiv');
        this.baseService.enableSelectWithEmpty('#shuffle-all-section', this.allSections, this.constants.sectionObj, null);
        var sec = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions);
        if(sec.length < 1) {
            this.baseService.addHideClass('.studnet-data');
        } else {
            this.baseService.removeHideClass('.studnet-data');
        }

    }

    resetForm() {
        this.wizardComponent.reset();
        this.baseService.addHideClass('.promotionDiv');
        this.baseService.addDisabled('#shuffleListData');
        this.baseService.dataTableDestroy('datatable-shuffle-student-list');
        this.baseService.enableSourceDataTable(".datatable-shuffle-student-list", []);
        this.baseService.removeClass('#classes', 'not-active');
        this.baseService.removeClass('.sectionsList', 'not-active');
        this.baseService.removeClass('#allsections', 'not-active');
        this.baseService.enableSelectWithEmpty('#shuffle-all-section', this.allSections, this.constants.sectionObj, null);
        this.baseService.removeHideClass('.submitClass');
    }

    setValidations() : any {
        var dataFound = false;
        this.sectionId = this.baseService.extractOptions(this.selecSection.nativeElement.selectedOptions)[0].id;
         if(this.sectionId.length < 1) {
            this.baseService.showNotification("Select 'Move To' Section", "", 'bg-danger');
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    saveValidation() : any {
        var dataFound = false;
        var notify ={},notifyTo ={};
        notify['sms'] = this.sms.nativeElement.checked;
        /*notify['email'] = this.email.nativeElement.checked;*/
        notify['push'] = this.push.nativeElement.checked;
        notifyTo['status'] =  (this.sms.nativeElement.checked || this.push.nativeElement.checked) ? "Sent" : "Draft";
        this.finalData['notify'] = notify;
        this.finalData['notifyTo'] = notifyTo;
        this.sectionId = this.baseService.extractOptions(this.selecSection.nativeElement.selectedOptions)[0].id;
         if(this.sectionId.length < 1) {
            this.baseService.showNotification("Select 'Move To' Section", "", 'bg-danger');
        } else if(this.finalData.users.length < 1) {
            this.baseService.showNotification("Select Students", "", 'bg-danger');
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    disable() {
        this.baseService.removeClass('#classes', 'not-active');
        this.baseService.removeClass('.sectionsList', 'not-active');
        this.baseService.removeClass('#allsections', 'not-active');
        this.baseService.removeHideClass('.submitClass');
    }
}