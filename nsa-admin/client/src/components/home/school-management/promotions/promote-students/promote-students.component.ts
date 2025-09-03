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

@ Component({
    selector: 'promote-student',
    templateUrl: 'promote-students.html'
})

export class PromoteStudentComponent implements OnInit {


    @ViewChild(WizardComponent) wizardComponent: WizardComponent;
    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChild('date') date: ElementRef;
    @ViewChild('Section') msection: ElementRef;
    @ViewChild('sms') sms: ElementRef
    // @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef;

    classId: any;
    classSections: any;
    checkObj: boolean = true;
    classes: any;
    sections: any;
    allSections: any;
    curSections: any
    users: any;
    studentData: any = {}
    className: any;
    postClass: any;
    mappedSections: any[] = [];
    finalData: any;
    oldClass: any;
    sectionId: any;
    usersCount: any;
    failedUserCount: any;
    failedUsers: any[] = [];
    academicYears: any[] = [];
    cAcademicYear: any;
    nAcademicYear: any;


    constructor(private baseService: BaseService, private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private element: ElementRef,
                private commonService: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
        //this.getActiveClasses();
        this.getFeatureChannelConfiguration();
    }

    openOverlay(event:any, classes:any, academicYears: any) {
        this.classSections = classes;
        this.academicYears = academicYears;
        this.cAcademicYear = (this.academicYears.length >= 1) ? this.academicYears[1].academicYear : this.constants.cAcademicYear;
        this.nAcademicYear = (this.academicYears.length > 0) ? this.academicYears[0].academicYear : this.constants.nAcademicYear;
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    resetForm() {
        this.wizardComponent.reset();
        this.baseService.addHideClass('.promotionDiv');
        this.baseService.addHideClass('.select-section');
        this.baseService.removeClass('.selectClass', 'not-active');
        this.baseService.enableSelectWithEmpty('#select-class', this.classSections, this.constants.classObj, null);
    }

    getSectionByClass() {
        this.baseService.addHideClass('.promotionDiv');
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        if(this.classId.length < 1) {
            this.baseService.addHideClass('.select-section');
        }  else {
            this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
            this.baseService.removeHideClass('.select-section');

            this.commonService.get(this.serviceUrls.getPromotionsSec + this.classId + '/' + this.cAcademicYear).then(
                sections => this.callBackSections(sections)
            )
        }
    }

    callBackSections(data: any) {
        this.sections = data;
        this.baseService.enableMultiSelectFilteringAll('#select-section', data, this.constants.sectionsObj, null)
    }

    sectionChange(event: any) {
        this.baseService.addHideClass('.promotionDiv');
    }

    getStudentData() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        var dataFound = this.setValidations();
        var data = {};
        var classes = [];
        var classObj = {};
        if(dataFound){
            var classVal = _.filter(this.classSections, {"classId" : this.classId});
            this.oldClass = classVal;
            this.className = classVal ? classVal[0].className : "0";
            this.getSectionDetails(this.baseService.extractOptions(this.msection.nativeElement.selectedOptions));
            classObj['id'] = this.classId;
            classObj['section'] = this.baseService.extractOptionValue(this.msection.nativeElement.selectedOptions);
            classes.push(classObj);
            data['classes'] = classes;
            data['year'] = (this.academicYears.length >= 1) ? this.academicYears[1].academicYear : this.constants.cAcademicYear;
            data['academicYear'] = (this.academicYears.length > 0) ? this.academicYears[0].academicYear : this.constants.nAcademicYear;
            data['orderBy'] = classVal ? classVal[0].orderBy : "0";
            var url = this.serviceUrls.getPromoteStudents;
            this.commonService.post(url, data).then(students => this.callBackStudents(students));
        }
    }

    getSectionDetails(secs: any) {
        var sectionObjs : any[] = [];
        var $this = this;
        _.forEach(secs, function (val: any, index: any) {
            var data = _.filter($this.sections, {"section_id": val.id});
            if(data.length > 0) {
                sectionObjs.push(data[0]);
            }
            if(index == (secs.length -1)) {
                $this.curSections = sectionObjs;
            }
        })

    }

    callBackStudents(students: any) {
        this.postClass = students.postClass;
        this.allSections = students.sections;
        this.users = students.users;
        if(this.postClass) {
            var userData = {}
            userData['users'] = this.users;
            userData['newClass'] = this.postClass;
            userData['oldClass'] = this.oldClass;
            userData['oldSections'] = this.curSections;
            setTimeout(() => {
                for (var i = 0; i < this.curSections.length; i++) {

                    //TODO change to section_id
                    if(this.curSections[i].promoted_section_name == null) {
                        this.baseService.enableSelect("#"+ i +"", this.allSections, this.constants.sectionObj, this.curSections[i].section_id);
                    }

                }
                if(this.users.length > 0) {
                    this.baseService.removeHideClass('.promotionDiv');
                    this.baseService.enableSourceDataTable(".datatable-promote-student-list", userData);
                    this.baseService.removeDisabled('.next');
                } else {
                    this.baseService.showNotification('There is No Students in Selected Section', "", 'bg-danger');
                    this.baseService.addHideClass('.promotionDiv');
                }

            }, 1000);
        } else {
            this.baseService.showNotification("No class to Promote", "", 'bg-danger');
        }

    }

    disable() {
        this.baseService.removeClass('.selectClass', 'not-active');
        this.baseService.removeDisabled('.next')
    }


    setValidations() : any {
        var dataFound = false;
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.sectionId = this.baseService.extractOptions(this.msection.nativeElement.selectedOptions);
        if(this.classId.length < 1) {
            this.baseService.showNotification("Enter Class Details", "", 'bg-danger');
        } else if (this.sectionId.length < 1) {
            this.baseService.showNotification("Enter Section Details", "", 'bg-danger');
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    onStudentInfo(event: any) {
        this.baseService.triggerClick("#promoteList");
    }

    onSectionInfo(event: any) {
        this.baseService.addClass('.selectClass', 'not-active');
        this.baseService.triggerClick("#promoteStud");
    }

    sectionMap(event: any) {
        this.mappedSections = JSON.parse(event.target.value);
        var $this = this;
        if(!_.isEmpty(this.mappedSections['sectionObjs'])) {
            _.forEach(this.mappedSections['sectionObjs'], function (val: any, index: any) {
                var sectionObj = _.filter($this.allSections, {"sectionId" : val.sectionId});
                val.sectionCode = sectionObj.length > 0 ? sectionObj[0].sectionCode : "";
                if(index == ($this.mappedSections['sectionObjs'].length - 1)) {
                    $('#updateSatus').val(JSON.stringify($this.mappedSections));
                }
            })
        } else {
            this.baseService.addDisabled('.next')
        }

    }

    onSaveStudent(event: any, id: any) {
        var notify ={},notifyTo ={};
        notify['sms'] = this.sms.nativeElement.checked;
        /*notify['email'] = this.email.nativeElement.checked;*/
        notify['push'] = this.push.nativeElement.checked;
        notifyTo['status'] =  (this.sms.nativeElement.checked || this.push.nativeElement.checked) ? "Sent" : "Draft";
        this.finalData['notify'] = notify;
        this.finalData['notifyTo'] = notifyTo;
        if(this.usersCount < 1){
            this.baseService.showNotification("No Students have been Selected to Promote", "", 'bg-danger');
        }else{
            this.baseService.enableBtnLoading(id);
            this.commonService.post(this.serviceUrls.promoteStudents, this.finalData).then(
                result => this.saveCallBack(result, false, id),
                error => this.saveCallBack(<any>error, true, id))
        }
    }

    promotionsData(event: any) {
        this.finalData =  JSON.parse(event.target.value);
        this.usersCount = this.finalData.users.length;
        this.failedUserCount = this.finalData.failedUsers.length;
        this.failedUsers = this.finalData.failedUsers;
        this.baseService.enableSourceDataTable(".datatable-promote-final-list", this.finalData.users);
    }

    failedClick() {
        this.baseService.openModal('modal_subtitle')
    }

    saveCallBack(result:any, error:boolean, btnVal: any) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.disableBtnLoading(btnVal);
            this.baseService.dataTableReload('datatable-promotions');
            this.baseService.closeOverlay('#reportStudent');
        }
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#reportStudent')
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.commonService.getActiveFeatureChannelDetails(data);
    }
}