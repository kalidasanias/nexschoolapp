/**
 * Created by Cyril on 3/31/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";
declare var moment: any;

@Component({
    selector: 'new-timetable-configuration',
    templateUrl: 'new-timetable-configuration.html',
})

export class NewTimetableConfigurationComponent implements OnInit {

    @ViewChild('selectClass') selectClass:ElementRef
    @ViewChild('singlePeriods') singlePeriods:ElementRef
    @ViewChild('line') line:ElementRef
    @ViewChild('daysSelect') daysSelect:ElementRef
    @ViewChild('pickerStartTime') pickerStartTime:ElementRef
    @ViewChild('pickerEndTime') pickerEndTime:ElementRef

    classId:any;
    days:any;
    sections:any;
    classes:any;
    demoChk:any;
    date: Date = new Date(2016, 5, 10, 9,0,0);
    date1 : Date = new Date(0,0,0, 9,0);
    data: any;
    date2 : Date = new Date(0,0,0, 15,0);
    date3 : Date = new Date(0,0,0, 15,0);
    date4 : Date = new Date(0,0,0, 15,0);

    periods: any;
    timeTableConfigForm: any;
    timepicker: any;
    config: any;

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private fb : FormBuilder,
                private constants: Constants) {
    }

    ngOnInit() {
        this.baseService.selectStyle();
        this.getAllClasses();
        this.getAllDays();
        this.getAllPeriods();
        this.createForm();
        this.getAllTimeTableConfig();
    }

    createForm() {
        this.timeTableConfigForm = this.fb.group({
            classes : [],
            days: [],
            schoolHours: [
                {
                 from: '',
                 to: ''
                }
            ],
            periods: []
        })
    }

    getAllClasses() {
        this.commonService.get(this.serviceUrls.timetableAllConfigClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data:any) {
        this.classes = data;
        this.baseService.enableMultiSelectFilteringAll('#bootstrap-class', data, this.constants.configClassObject, null);
    }

    getAllTimeTableConfig() {
        this.commonService.get(this.serviceUrls.timetableConfig).then(
            config => this.callBackConfig(config)
        )
    }

    getAllConfig() {
        this.commonService.get(this.serviceUrls.timetableConfig).then(
            config => this.callBackTableConfig(config)
        )
    }

    callBackConfig(data:any) {
        this.config = data;
    }

    callBackTableConfig(data: any) {
        for (var i = 0; i < this.days.length; i++) {
            if(this.days[i].id != 6) {
                this.baseService.addChecked('#workDay' + this.days[i].id);

            }
        }
        /*for(var i = 0; i < this.classes.length; i++) {
            var configDetails = data.find((obj:any) => obj.applicable_class === this.classes[i].classId);
            if(configDetails == undefined) {
                dataObj.push(this.classes[i])
            }
        }
        this.baseService.enableMultiSelectFilteringAll('#bootstrap-class', dataObj, this.constants.classObj, null);*/
    }

    getAllDays() {
        this.commonService.get(this.serviceUrls.getAllDays).then(
            days => this.callBackDays(days)
        )
    }

    callBackDays(data:any) {
        this.days = data;
        this.data = Array(1).fill(1);
    }

    openOverlay(event:any) {
        this.resetForm();
        this.getAllClasses();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#new_timetable');
    }


    generatePeriod() {
        var value = this.baseService.extractOptions(this.singlePeriods.nativeElement.selectedOptions)[0].id;
        var startTime = this.pickerStartTime.nativeElement.children[0].children[0].children[1].children[0].value;
        var endTime = this.pickerEndTime.nativeElement.children[0].children[0].children[1].children[0].value;
        var sTime = (moment(startTime, "h:mm A").format("HH:mm")).split(':');
        var eTime = (moment(endTime, "h:mm A").format("HH:mm")).split(':');
        this.data = Array(Number(value)).fill(value);
        setTimeout(() => {
            for (var i = 0; i < this.data.length; i++) {
                this.baseService.enableSelect("#"+ i +"", this.periods, ['name', 'id'], (i + 1));
                
                this.date3[i] = new Date(0,0,0, sTime[0], sTime[1])
                this.date4[i] = new Date(0,0,0, eTime[0], eTime[1])
            }
            this.baseService.removeHideClass('#classHours');
        }, 1000);
    }

    getAllPeriods() {
        this.commonService.get(this.serviceUrls.getAllPeriods).then(
            periods => this.callBackPeriods(periods)
        )
    }

    callBackPeriods(data:any) {
        this.periods = data;
        this.baseService.enableSelectWithEmpty('#bootstrap-periods', this.periods, ['id', 'id'], null);
       this.data = Array(1).fill(1);
        setTimeout(() => {
            for (var i =0 ; i <  this.data.length; i++) {
                this.baseService.enableSelect("#"+ i +"", this.periods, ['name', 'id'], (i + 1));
                this.date3[i] = new Date(0, 0, 0, 0,0);
                this.date4[i] = new Date(0, 0, 0, 0, 0);
                this.baseService.removeChecked('#save-checked')
            }
        }, 100);
    }

    save(id: any) {
        this.setFormValues();
        var dataFound = this.setValidations();
        if(this.timeTableConfigForm.valid && dataFound ) {
            this.baseService.enableBtnLoading(id);
            this.commonService.post(this.serviceUrls.timetableConfig, this.timeTableConfigForm._value).then(
                result => this.saveTimetableConfigCallBack(result, id, false),
                error => this.saveTimetableConfigCallBack(<any>error, id, true))
        }
    }


    saveTimetableConfigCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.dataTableReload('datatable-timetable-config');
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#new_timetable');
        }
        this.baseService.disableBtnLoading(id);
    }

    extractTimetableCheckbox(arr: any[]): any[] {
        let options: any[] = [];
        for(let i=0; i< arr.length; i++) {
            var children: any[] = arr[i].children;
            if(children[0] != undefined) {
                if(children[0].children[0].checked) {
                    options.push(children[0].children[0].value);
                }
            }
        }
        return options;
    }

    resetForm() {
        this.createForm();
        this.getAllConfig();
        this.getAllClasses();
        this.callBackPeriods(this.periods);
        this.baseService.addHideClass('#classHours');
        this.date = new Date(9,0);
        this.date1 = new Date(0,0,0, 9,0);
        this.date2 = new Date(0,0,0, 15,0);
    }

    setFormValues() {
        this.timeTableConfigForm._value.days =this.extractTimetableCheckbox(this.daysSelect.nativeElement.children);
        this.timeTableConfigForm._value.classes = this.baseService.extractOptions(this.selectClass.nativeElement.selectedOptions);
        this.timeTableConfigForm._value.schoolHours.from = this.pickerStartTime.nativeElement.children[0].children[0].children[1].children[0].value;
        this.timeTableConfigForm._value.schoolHours.to = this.pickerEndTime.nativeElement.children[0].children[0].children[1].children[0].value;
        this.timeTableConfigForm._value.periods = this.baseService.extractTimetableData(this.line.nativeElement.children);
    }

    setValidations() {
        var dataFound = false;
        this.timeTableConfigForm._value.days =this.extractTimetableCheckbox(this.daysSelect.nativeElement.children);
        this.timeTableConfigForm._value.classes = this.baseService.extractOptions(this.selectClass.nativeElement.selectedOptions);
        if(this.timeTableConfigForm._value.classes.length < 1) {
            this.baseService.showNotification("Enter Class Details", '', 'bg-danger');
        } else if(this.timeTableConfigForm._value.days.length < 1) {
            this.baseService.showNotification("Enter Working Day", '', 'bg-danger');
        } else {
            dataFound = this.checkTimeValidations();
        }

        return dataFound;
    }

    checkTimeValidations() {
        var timings;
        var startTime1 = this.pickerStartTime.nativeElement.children[0].children[0].children[1].children[0].value;
        var endTime1 = this.pickerEndTime.nativeElement.children[0].children[0].children[1].children[0].value;
        var startTime = moment(startTime1, "h:mm A").format("HH:mm");
        var endTime = moment(endTime1, "h:mm A").format("HH:mm");
        var periods: any[] = [];
        periods = this.baseService.extractTimetableData(this.line.nativeElement.children)
        for ( var i=0 ; i < periods.length; i++) {
            var sTime = moment(periods[i].periodStartTime, "h:mm A").format("HH:mm");
            var eTime = moment(periods[i].periodEndTime, "h:mm A").format("HH:mm");
            if(periods.length == 1) {
                if ((sTime == startTime) && (eTime == endTime)) {
                    timings = true;
                } else {
                    timings = false;
                    break
                }
            }
            if (i != 0 && i != (periods.length - 1) ) {
                timings = this.checkPeriodTimings(sTime, startTime, eTime, endTime);
                if(timings === false) {
                    this.baseService.showNotification(this.constants.periodValidation + periods[i].periodName, '', 'bg-danger');
                    break;
                }
            }

            if(i == 0 && periods.length > 1) {
                timings = this.checkTimings(sTime, startTime, eTime, endTime);
                if(timings === false) {
                    this.baseService.showNotification(this.constants.periodValidation + periods[i].periodName, '', 'bg-danger');
                    break;
                }
            }

            if(i == (periods.length - 1) && periods.length > 1) {
                timings = this.checkEndTimings(eTime, endTime, sTime, startTime);
                if(timings === false) {
                    this.baseService.showNotification(this.constants.periodValidation + periods[i].periodName, '', 'bg-danger');
                    break;
                }
            }

        }
        return timings;
    }

    checkPeriodTimings(sTime: any, startTime: any, eTime: any, endTime: any) {
        var timings;
        if (((sTime < endTime) && (sTime > startTime)) && ((eTime < endTime) && (eTime > startTime))) {
            timings = true;
        } else {
            timings = false;
        }

        return timings;
    }

    checkTimings(sTime: any, startTime: any, eTime: any, endTime: any) {
        var timings;
        if ((sTime == startTime) && ((eTime < endTime) && (eTime > startTime))) {
            timings = true;
        } else {
            timings = false;
        }

        return timings;
    }

    checkEndTimings( eTime: any, endTime: any, sTime: any, startTime: any) {
        var timings;
        if ((eTime == endTime) && (((sTime > startTime) && (sTime < endTime)))) {
            timings = true;
        } else {
            timings = false;
        }

        return timings;
    }
}