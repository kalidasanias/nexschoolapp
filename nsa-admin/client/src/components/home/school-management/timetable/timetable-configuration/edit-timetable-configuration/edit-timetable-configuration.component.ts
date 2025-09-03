/**
 * Created by Sai Deepak on 09-Apr-17.
 */

import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";
declare var moment: any;

@Component({
    selector: 'edit-timetable-configuration',
    templateUrl: 'edit-timetable-configuration.html',
})

export class EditTimetableConfigurationComponent implements OnInit {

    @ViewChild('selectClass') selectClass:ElementRef
    @ViewChild('singleEditPeriods') singlePeriods:ElementRef
    @ViewChild('line') line:ElementRef
    @ViewChild('daysSelect') daysSelect:ElementRef
    @ViewChild('pickerStartTime') pickerStartTime:ElementRef
    @ViewChild('pickerEndTime') pickerEndTime:ElementRef

    classId:any;
    days:any;
    sections:any;
    classes:any;
    demoChk:any;
    data: any;
    periods: any;
    editTimetableconfigForm: any;
    configDetails: any;
    modalId: any;
    date: any = {} ;
    date1: any = {};
    date2: any = {};
    date3: any = {};
    schoolStartDate: any ;
    schoolEndDate: any;
    periodsNo: any;
    enableData: boolean = false;
    enable: boolean = false;


    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private fb : FormBuilder,
                private constants: Constants) {
    }

    ngOnInit() {
        this.getAllDays();
        this.getAllPeriods();
        this.createForm();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.TIMETABLE_CONF_PERMISSIONS);
    }

    createForm() {
        this.editTimetableconfigForm = this.fb.group({
            classId : '',
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

    getAllDays() {
        this.commonService.get(this.serviceUrls.getAllDays).then(
            days => this.callBackDays(days)
        )
    }

    callBackDays(data:any) {
        this.days = data;
    }

    openOverlay(event:any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#edit_timetable');
    }

    getTimeTableConfigById(event: any) {
        var value = JSON.parse(event.target.value);
        var cyear = (localStorage.getItem(this.constants.cyear) == 'true');
        this.enableData = value.editPermissions && cyear;
        this.modalId = event;
        this.commonService.get(this.serviceUrls.timetableConfig + value.timetable_config_id).then(
            configDetails => this.callBackConfigDetails(configDetails)
        )
    }

    callBackConfigDetails(val: any) {
        this.configDetails = val;
        var periods = val.periods;
        var working_days = val.working_days;
        var schoolStartTime = (val.school_hours['from']);
        var schoolEndTime = (val.school_hours['to']);
        var sTime = (moment(schoolStartTime, "h:mm A").format("HH:mm")).split(':');
        var eTime = (moment(schoolEndTime, "h:mm A").format("HH:mm")).split(':');
        this.date2 = new Date(0, 0, 0, sTime[0], sTime[1]);
        this.date3 = new Date(0, 0, 0, eTime[0], eTime[1]);
        this.getCheckedDays(working_days);
        this.getPeriods(periods);
    }

    private getCheckedDays(days : any) {
        setTimeout(() => {
            for (var i = 0; i < this.days.length; i++) {
                var day = days.find((obj:any) => obj === this.days[i].id);
                if (day != undefined) {
                    console.log("sss", day);
                    this.baseService.addChecked("." + this.days[i].id + "");
                } else {
                    this.baseService.removeChecked("." + this.days[i].id + "");
                }
            }
        }, 200);
    };

    private getPeriods(periods: any) {
        this.periodsNo = periods.length;
        this.baseService.enableSelect('#bootstrap-edit-periods', this.periods, ['id', 'id'], periods.length);
        this.data = Array(periods.length).fill(1);
        setTimeout(() => {
            for (var i = 0; i < periods.length; i++) {
                var startTime = (periods[i].period_start_time).split(':');
                var endTime = (periods[i].period_end_time).split(':');
                this.date[i] = new Date(0, 0, 0, startTime[0], startTime[1]);
                this.date1[i] = new Date(0, 0, 0, endTime[0], endTime[1]);
                this.baseService.enableSelect("#edit" + i + "", this.periods, ['name', 'id'], periods[i].period_id);
                if (periods[i].is_break) {
                    this.baseService.addChecked("#checkbox" + i + "");
                } else {
                    this.baseService.removeChecked("#checkbox" + i + "");
                }
            }
            this.baseService.openOverlay(this.modalId);
        }, 200);

    };

    generatePeriod() {
        var value = this.baseService.extractOptions(this.singlePeriods.nativeElement.selectedOptions)[0].id;
        this.data = Array(Number(value)).fill(value);
        var periods = this.baseService.extractTimetableData(this.line.nativeElement.children);
        setTimeout(() => {
            for (var i =0; i< value; i++) {
                if(periods[i] != undefined && periods[i].periodStartTime != "" && periods[i].periodEndTime != "") {
                    var sTime = (moment(periods[i].periodStartTime, "h:mm A").format("HH:mm")).split(':');
                    var eTime = (moment(periods[i].periodEndTime, "h:mm A").format("HH:mm")).split(':');
                    this.date[i] =  new Date(0,0,0, sTime[0], sTime[1]);
                    this.date1[i] =  new Date(0,0,0, eTime[0], eTime[1]);
                    if(periods[i].break) {
                        this.baseService.addChecked("#checkbox" + i + "");
                    }
                    this.baseService.enableSelect("#edit"+ i +"", this.periods, ['name', 'id'], periods[i].periodId);
                } else {
                    this.baseService.enableSelect("#edit"+ i +"", this.periods, ['name', 'id'], i + 1);
                }
            }
        }, 300);
    }

    getAllPeriods() {
        this.commonService.get(this.serviceUrls.getAllPeriods).then(
            periods => this.callBackPeriods(periods)
        )
    }

    callBackPeriods(data:any) {
        this.periods = data;
    }

    save(id: any) {
        this.setFormValues();
        var dataFound = this.setValidations();
        this.baseService.enableBtnLoading(id);
        if(this.editTimetableconfigForm.valid && dataFound) {
            this.commonService.put(this.serviceUrls.timetableConfig + this.configDetails.timetable_config_id, this.editTimetableconfigForm._value).then(
                result => this.updateTimetableConfigCallBack(result, id, false),
                error => this.updateTimetableConfigCallBack(<any>error, id, true))
        }
    }

    updateTimetableConfigCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#edit_timetable');
            this.baseService.dataTableReload('datatable-timetable-config');
        }
        this.baseService.disableBtnLoading(id);
    }

    setFormValues() {
        this.editTimetableconfigForm._value.days =this.extractTimetableCheckbox(this.daysSelect.nativeElement.children);
        this.editTimetableconfigForm._value.schoolHours.from = this.pickerStartTime.nativeElement.children[0].children[0].children[1].children[0].value;
        this.editTimetableconfigForm._value.schoolHours.to = this.pickerEndTime.nativeElement.children[0].children[0].children[1].children[0].value;
        this.editTimetableconfigForm._value.periods = this.baseService.extractTimetableData(this.line.nativeElement.children);
        this.editTimetableconfigForm._value.classId = this.configDetails.applicable_class;
    }

    setValidations() {
        var dataFound = false;
        this.editTimetableconfigForm._value.days =this.extractTimetableCheckbox(this.daysSelect.nativeElement.children);
        if(this.editTimetableconfigForm._value.days.length < 1) {
            this.baseService.showNotification("Enter Working Day", '', 'bg-danger');
        } else {
            dataFound = this.checkTimeValidations();
        }

        return dataFound;
    }

    extractTimetableCheckbox(arr: any[]): any[] {
        let options: any[] = [];
        for(let i=1; i< arr.length; i++) {
            var children: any[] = arr[i].children;
            if(children[0].children[0].checked) {
                options.push(children[0].children[0].value);
            }
        }
        return options;
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