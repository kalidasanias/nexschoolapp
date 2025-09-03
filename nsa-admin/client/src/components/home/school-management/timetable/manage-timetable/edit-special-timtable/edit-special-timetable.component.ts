/**
 * Created by Sai Deepak on 15-Apr-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
declare var moment :any
declare var _ :any


@Component({
    selector: 'edit-special-timetable',
    templateUrl: 'edit-special-timetable.html'
})

export class EditSpecialDayComponent implements OnInit {

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
    dayId: any;
    editSpecialDayForm: any
    specialTimetable: any;
    classDays: any;
    feature:any[];

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.createForm();
        this.getFeatureChannelConfiguration();
    }

    createForm() {
        this.editSpecialDayForm = this.fb.group({
            classId: '',
            sectionId: '',
            className: '',
            sectionName: '',
            date: '',
            updatedDate: '',
            status: '',
            dayId: '',
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
        this.getFeatureChannelConfiguration();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#editSpecialTimetable')
    }

    getSpecialDay(event: any) {
        this.modalId = event;
        var value = JSON.parse(event.target.value);
        this.specialTimetable = value;
        this.dayId = value.dayId;
        var weekdate = moment(new Date()).week()
        this.commonService.get(this.serviceUrls.classTimetable + value.classId + '/' + value.sectionId + '?weekNo=' + weekdate).then(
            result =>this.callBackTimetableById(result)
        )
        this.editForm(value);
    }

    callBackTimetableById(data: any){
        var result = _.uniqBy(data, 'dayId');
        var sortResult = _.orderBy(result, ['dayId'],['asc']);
        this.classDays = sortResult;
        this.baseService.enableSelectWithEmpty('#special-day-timetable1', this.classDays, this.constants.dayObj, this.dayId);
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
        if(this.editSpecialDayForm.valid && dataFound){
            this.setFormValues();
            this.baseService.enableBtnLoading(id);
            this.commonService.put(this.serviceUrls.specialDayTimetable, this.editSpecialDayForm._value).then(
                result => this.saveSpecialDayCallBack(result, id, false),
                error => this.saveSpecialDayCallBack(<any>error, id, true)
            )
        }
    }

    saveSpecialDayCallBack(result:any, id:any, error:boolean) {
        var successMsg =  "Special Day Timetable Updated";
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(successMsg, "", 'bg-success');
            this.baseService.closeOverlay('#editSpecialTimetable');
            this.baseService.dataTableReload('datatable-special-day')
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    setFormValues() {
        this.editSpecialDayForm._value.notify.sms = this.sms.nativeElement.checked;
        this.editSpecialDayForm._value.notify.email = this.email.nativeElement.checked;
        this.editSpecialDayForm._value.notify.push = this.push.nativeElement.checked;

        if(!this.editSpecialDayForm._value.notify.sms && !this.editSpecialDayForm._value.notify.push){
            this.editSpecialDayForm._value.status = false;
        }else {
            this.editSpecialDayForm._value.status =true;
        }
        this.editSpecialDayForm._value.date = this.specialTimetable.date;
        this.editSpecialDayForm._value.updateDate = this.dueDate.nativeElement.value;
        this.editSpecialDayForm._value.classId = this.specialTimetable.classId;
        this.editSpecialDayForm._value.sectionId = this.specialTimetable.sectionId;
        this.editSpecialDayForm._value.dayId = this.baseService.extractOptions(this.singleTimetable.nativeElement.selectedOptions)[0].id;
    }

    resetForm() {
        this.createForm();
    }

    setValidations() : any {
        var dataFound = false;
        this.editSpecialDayForm._value.updatedDate = this.dueDate.nativeElement.value;
        this.editSpecialDayForm._value.dayId = this.baseService.extractOptions(this.singleTimetable.nativeElement.selectedOptions)[0].id;
        if (this.editSpecialDayForm._value.updatedDate.length < 1) {
            this.baseService.showNotification("Enter Date", "", 'bg-danger');
        } else if (this.editSpecialDayForm._value.dayId.length < 1) {
            this.baseService.showNotification("Enter Timetable Followed", "", 'bg-danger');
        } else {
            dataFound = true;
        }
        return dataFound;
    }

     editForm(value: any) {
        this.editSpecialDayForm = this.fb.group({
            classId: value.classId,
            sectionId: value.sectionId,
            className: value.className,
            sectionName: value.sectionName,
            date: moment(value.date).format('ll'),
            "notify":  this.fb.group({
                "sms":'',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': this.constants.Sent
            })
        })
         this.commonService.getActiveFeatureChannelDetails(this.feature);
         this.baseService.openOverlay(this.modalId);
    }

}