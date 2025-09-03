import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls} from "../../../../../common/index";
import {Constants} from "../../../../../common/constants/constants";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector : 'add-school-holidays',
    templateUrl: 'add-school-holidays.html'
})
export class AddSchoolHolidayTypeComponent implements OnInit{

    @ViewChild('single') single: ElementRef;
    @ViewChild('fullDate') fullDate: ElementRef
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef


    private selectedOptions: number[];
    schoolholidayForm:any;
    SchoolHoliday:any;
    buttonVal: string;
    modalId:any;
    holidayTypes:any;
    holidayTypeId:any;
    holidayName:any;
    feature:any[];

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private constants : Constants,
                private commonService: CommonService,
                private fb :FormBuilder) {

    }

    ngOnInit() {
        this.SchoolHoliday='';
        this.getHolidayTypes();
        this.createForm();
        this.getFeatureChannelConfiguration();
        this.baseService.enablePickerDate();
    }

    openOverlay(event: any) {
        this.buttonVal = this.constants.Save;
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.baseService.openOverlay(event);
        this.resetForm();
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#addschoolholiday');
    }

    createForm() {
        this.fullDate.nativeElement.value = '';
        this.schoolholidayForm = this.fb.group({
            'holidayName': ['',Validators.required],
            'fullDate':[''],
            'holidayTypeId':'',
            'status':"",
            "notify":  this.fb.group({
                "sms":'',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': this.constants.Sent
            })
        }
        );
    }

    getschoolHoliday(event: any) {
        this.modalId = event;
        this.commonService.get(this.serviceUrls.schoolHoliday + event.target.value).then(
            result => this.callBack(result)
        );
    }

    callBack(value:any) {
        this.SchoolHoliday = value;
        this.editForm(value);
        this.buttonVal = this.constants.Update;
        this.baseService.openOverlay(this.modalId);
    }

    editForm(form:any) {
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.schoolholidayForm = this.fb.group({
            'holidayName': [form.holidayName,Validators.required],
            'fullDate': [form.fullDate],
            'status':'',
                "notify":  this.fb.group({
                    "sms":'',
                    "email": '',
                    "push": ''
                }),
                'notifyTo': this.fb.group({
                    'status': this.constants.Sent
                })
        });
        this.baseService.enableSelectWithEmpty('#select-schoolholiday',  this.holidayTypes, this.constants.holidayTypesObj, form.holidayTypeId);
        this.schoolholidayForm._value.holidayTypeId = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].id;
    };


    saveSchoolHoliday(id: any) {
        this.schoolholidayForm._value.notify.sms = this.sms.nativeElement.checked;
        this.schoolholidayForm._value.notify.email = this.email.nativeElement.checked;
        this.schoolholidayForm._value.notify.push = this.push.nativeElement.checked;
        this.setFormStatus();
        this.schoolholidayForm._value.holidayTypeId = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].id;
        this.schoolholidayForm._value.holidayType = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].name;
        this.schoolholidayForm._value.fullDate = this.fullDate.nativeElement.value;
        var dataFound = this.setValidation();
        if (this.schoolholidayForm.valid && dataFound) {
            this.baseService.enableBtnLoading(id)
            if (this.SchoolHoliday.holidayId == undefined) {
                this.commonService.post(this.serviceUrls.schoolHoliday, this.schoolholidayForm._value).then(
                    result => this.saveSchoolHolidayCallBack(result, id, false),
                    error => this.saveSchoolHolidayCallBack(<any>error, id, true))


           } else {
                this.commonService.put(this.serviceUrls.schoolHoliday + this.SchoolHoliday.holidayId, this.schoolholidayForm._value).then(
                    result => this.saveSchoolHolidayCallBack(result, id, false),
                    error => this.saveSchoolHolidayCallBack(<any>error, id, true))

            }
        }
    };

    setValidation(){
        var dataFound = false;
        if(this.schoolholidayForm._value.fullDate.length < 1){
            this.baseService.showNotification('Please Select Date',"",'bg-danger');
        }else {
            dataFound = true;
        }
        return dataFound;
    }

    setFormStatus(){
        if(!this.schoolholidayForm._value.notify.sms && !this.schoolholidayForm._value.notify.email && !this.schoolholidayForm._value.notify.push){
            this.schoolholidayForm._value.status = false;
        }else {
            this.schoolholidayForm._value.status =true;
        }

    }

    saveSchoolHolidayCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#addschoolholiday');
            this.baseService.dataTableReload('datatable-schoolholidays');
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id)
    }

    resetForm() {
        this.createForm();
        this.SchoolHoliday = "";
        this.baseService.enableSelectWithEmpty('#select-schoolholiday', this.holidayTypes, this.constants.holidayTypesObj, null);
    }

    getHolidayTypes() {
        this.commonService.get(this.serviceUrls.getAllHolidayTypes).then(
            result =>  this.callBackHolidayTypes(result)
        )
    }

    callBackHolidayTypes(value: any) {
        this.holidayTypes = value;
        this.baseService.enableSelectWithEmpty('#select-schoolholiday', this.holidayTypes, this.constants.holidayTypesObj, null);
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature =data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }
}