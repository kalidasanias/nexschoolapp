/**
 * Created by Sai Deepak on 15-Apr-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {CommonService} from "../../../../../../services/common/common.service";
import {Constants, ServiceUrls} from "../../../../../../common/index";
declare var moment :any
declare var _ :any


@Component({
    selector: 'add-special-timetable',
    templateUrl: 'add-special-timetable.html'
})

export class AddSpecialDayComponent implements OnInit {

    @ViewChild('singleClass') singleClass: ElementRef
    @ViewChild('singleSection') singleSection: ElementRef
    @ViewChild('singleTimetable') singleTimetable: ElementRef
    @ViewChild('dueDate') dueDate: ElementRef
    @ViewChild('radio') radio: ElementRef
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef

    modalId: any;
    classes: any;
    sections: any;
    classId: any;
    currentDate: any;
    sectionId: any;
    classDays: any;
    timetableFollowed: boolean = true;
    specialDayForm: any;
    feature:any[];

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private constants: Constants,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.getActiveClasses();
        this.createForm();
        this.getFeatureChannelConfiguration();
    }

    createForm() {
        this.specialDayForm = this.fb.group({
            classId: '',
            sectionId: '',
            date: '',
            dayId: '',
            status:'',
            "notify":  this.fb.group({
                "sms":'',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': this.constants.Sent
            })
        })
    }

    openOverlay(event: any) {
        this.resetForm();
        this.getFeatureChannelConfiguration();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#addSpecialTimetable')
    }

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
        this.baseService.enableSelectWithEmpty('#special-day-class', this.classes, this.constants.classObj, null);
    }

    getSectionByClass() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.sectionId = '';
        if(this.classId.length < 1) {
            this.baseService.addHideClass('#sections');
            this.timetableFollowed = true;
        }  else {
            this.baseService.removeHideClass('#sections');

            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then(
                sections => this.callBackSections(sections)
            )
        }
    }

    callBackSections(data: any) {
        this.sections = data;
        this.baseService.enableSelectWithEmpty('#special-day-section', data, this.constants.sectionObj, null)
    }

    getDayByTimetable(){
        this.sectionId = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].id;
        if(this.sectionId.length < 1) {
            this.timetableFollowed = true;
        }  else {
            this.timetableFollowed = false;
            var weekdate = moment(new Date()).week();
            this.commonService.get(this.serviceUrls.classTimetable + this.classId + '/' + this.sectionId + '?weekNo=' + weekdate).then(
                result =>this.callBackTimetableById(result)
            )
        }
    }
    callBackTimetableById(data: any){
        var result = _.uniqBy(data, 'dayId');
        var sortResult = _.orderBy(result, ['dayId'],['asc']);
        this.classDays = sortResult;
        this.baseService.enableSelectWithEmpty('#special-day-timetable', this.classDays, this.constants.dayObj, null);
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)

        )
    }

    callBackChannels(data: any) {
        this.feature = data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    save(id: any) {
        var dataFound = this.setValidations();
        if(this.specialDayForm.valid && dataFound){
            this.setFormValues();
            this.baseService.enableBtnLoading(id);
            this.commonService.post(this.serviceUrls.specialDayTimetable, this.specialDayForm._value).then(
                result => this.saveSpecialDayCallBack(result, id, false),
                error => this.saveSpecialDayCallBack(<any>error, id, true)
            )
        }
    }

    saveSpecialDayCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#addSpecialTimetable');
            this.baseService.dataTableReload('datatable-special-day')
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    setFormValues() {
        this.specialDayForm._value.notify.sms = this.sms.nativeElement.checked;
        this.specialDayForm._value.notify.email = this.email.nativeElement.checked;
        this.specialDayForm._value.notify.push = this.push.nativeElement.checked;
        if(!this.specialDayForm._value.notify.sms && !this.specialDayForm._value.notify.push){
            this.specialDayForm._value.status = false;
        }else {
            this.specialDayForm._value.status = true;
        }
        this.specialDayForm._value.date = this.dueDate.nativeElement.value;
        this.specialDayForm._value.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.specialDayForm._value.sectionId = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].id;
        this.specialDayForm._value.dayId = this.baseService.extractOptions(this.singleTimetable.nativeElement.selectedOptions)[0].id;
    }

    resetForm() {
        this.createForm();
        this.timetableFollowed = true;
        this.baseService.enableSelectWithEmpty('#special-day-timetable', this.classDays, this.constants.dayObj, null);
        this.baseService.addHideClass('#sections');
        this.baseService.enableSelectWithEmpty('#special-day-class', this.classes, this.constants.classObj, null);
    }

    setValidations() : any {
        var dataFound = false;
        this.specialDayForm._value.date = this.dueDate.nativeElement.value;
        this.specialDayForm._value.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.specialDayForm._value.dayId = this.baseService.extractOptions(this.singleTimetable.nativeElement.selectedOptions)[0].id;
        if(this.specialDayForm._value.classId.length < 1) {
            this.baseService.showNotification("Enter Class Details", "", 'bg-danger');
        } else if (!this.sectionId) {
            this.baseService.showNotification("Please Select Section", "", 'bg-danger');
        } else if (this.specialDayForm._value.date.length < 1) {
            this.baseService.showNotification("Enter Date", "", 'bg-danger');
        } else if (this.specialDayForm._value.dayId.length < 1) {
            this.baseService.showNotification("Enter Timetable Followed", "", 'bg-danger');
        } else {
            dataFound = true;
        }
        return dataFound;
    }


    getDetails(data: any, value :any, key: any, compareKey: any) : any[] {
        var array :any[]= [];

        data.forEach(function (obj:any) {
            for(let node in value) {
                if(obj[key] == value[node]) {
                    array.push(obj);
                }
            }
        });

        return array;
    }

}