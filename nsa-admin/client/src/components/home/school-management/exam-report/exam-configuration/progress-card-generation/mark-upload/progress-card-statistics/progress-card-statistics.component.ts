/**
 * Created by maggi on 24/05/17.
 */
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../../../services/base/base.service";
import {Component, OnInit, Input} from "@angular/core";
import {Constants, ServiceUrls} from "../../../../../../../../common/index";
import {CommonService} from "../../../../../../../../services/common/common.service";

@Component({
    selector : 'statistics',
    templateUrl: 'progress-card-statistics.html'
})

export class ProgressCardStatistics implements OnInit {
    object:any
    markListObj: any
    examScheduleId: any
    markListId: any
    rankObjs: any[] = []
    subjectId: any
    ranges: any[] = []
    rangeValues: any[] = []
    topPerformers: any[] = []
    gradeObj: any
    gradeDistributionObjs: any[] = []
    overAllChart: any
    subjectwiseChart: any

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private constants: Constants,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {

    }

    show(event: any) {
        this.markListObj = JSON.parse(event.target.value);
        this.markListId = this.markListObj.marklistId
        this.examScheduleId = this.markListObj.examScheduleId
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getranks + this.markListId)
        this.baseService.openOverlay(event);
        this.overallReport();
        this.subjectWiseReport();
    }

    closeOverlay() {
        this.baseService.closeOverlay("#statistics");
        this.resetValues();
        this.baseService.triggerClick('#examReport');
    }

    onRangeChange(value: any) {
        this.baseService.enableDivLoading('.pre-scrollable', '')
        this.commonService.get(this.serviceUrls.getranks + this.markListId + '?grade=' + value).then(
            result => this.callbackRanks(result, false),
            error => this.callbackRanks(<any>error, true))
    }

    callbackRanks(data: any, err: boolean) {
        if(err) {
            this.baseService.showNotification(data, "", 'bg-danger');
        } else {
            this.rankObjs = data
            this.baseService.disableDivLoading('.pre-scrollable');
        }
    }

    overallReport() {
        this.baseService.closePopover('overall-settings');
        this.baseService.enableLoadingWithMsg('')
        this.baseService.disableC3(this.overAllChart)
        this.commonService.get(this.serviceUrls.getMarkstat + this.markListId).then(
            result => this.callbackStatistics(result, false),
            error => this.callbackStatistics(<any>error, true))
    }

    callbackStatistics(data: any, err: boolean) {
        if(err) {
            this.baseService.showNotification(data, "", 'bg-danger');
        } else {
            this.onRangeChange(data.ranges[0])
            this.baseService.enableSelect('#grade-select', data.rangeObj, this.constants.gradeObj, null )
            this.overAllChart = this.baseService.enableC3('#overallReport', data)
            this.baseService.disableLoading()
        }
    }

    subjectWiseReport() {
        this.baseService.closePopover('subject-settings');
        this.baseService.enableLoadingWithMsg('')
        this.commonService.get(this.serviceUrls.examSchedule + this.examScheduleId).then(
            result => this.callbackSchedule(result, false),
            error => this.callbackSchedule(<any>error, true))
        this.baseService.disableEcharts('subjectWiseReport');

    }

    callbackSchedule(data: any, err: boolean) {
        if(err) {
            this.baseService.showNotification(data, "", 'bg-danger');
        } else {
            this.subjectId = data.schedule[0].subject_id
            this.getTopPerformers();
            this.commonService.get(this.serviceUrls.getGradeStatsBySub + this.markListId + '/' + this.subjectId).then(
                result => this.callbackGradeStats(result, false),
                error => this.callbackGradeStats(<any>error, true))
            this.baseService.enableSelect('#subject-select', data.schedule, this.constants.scheduleObj, null )
        }
    }

    callbackGradeStats(data: any, err: boolean) {
        if(err) {
            this.baseService.showNotification(data, "", 'bg-danger');
        } else {
            this.gradeObj = data
            this.ranges = data.ranges
            this.rangeValues = data.values
            this.gradeDistribution(this.ranges[0])
            this.subjectwiseChart = this.baseService.enableC3('#subjectWiseReport', data)
            this.baseService.disableLoading()
        }
    }

    onSubjectChange(value: any) {
        this.subjectId = value
        this.baseService.enableLoadingWithMsg('')
        this.getTopPerformers();
        this.baseService.disableC3(this.subjectwiseChart);
        this.commonService.get(this.serviceUrls.getGradeStatsBySub + this.markListId + '/' + value).then(
            result => this.callbackGradeStats(result, false),
            error => this.callbackGradeStats(<any>error, true))
    }

    resetValues() {
        this.baseService.disableC3(this.subjectwiseChart);
        this.baseService.disableC3(this.overAllChart);
        this.rankObjs = [];
        this.ranges = [];
        this.rangeValues = [];
        this.subjectId = '';
        this.markListId = '';
        this.object = '';
        this.rangeValues = [];
        this.topPerformers = [];
        this.gradeObj = '';
        this.gradeDistributionObjs = [];
        this.baseService.closePopover('overall-settings');
        this.baseService.closePopover('subject-settings');
    }

    gradeDistribution(value: any) {
        this.baseService.enableDivLoading('.grade-istribution', '');
        this.commonService.get(this.serviceUrls.getGradeRankBySub + this.markListId + '/' + this.subjectId + '?grade=' + value).then(
            result => this.callbackGradeDistribution(result, false),
            error => this.callbackGradeDistribution(<any>error, true))
    }

    callbackGradeDistribution(data: any, err: boolean) {
        if (err) {
            this.baseService.showNotification(data, "", 'bg-danger');
        } else {
            this.gradeDistributionObjs = data;
            this.baseService.disableDivLoading('.grade-istribution')
        }
    }

    getTopPerformers() {
        this.commonService.get(this.serviceUrls.getGradeRankBySub + this.markListId + '/' + this.subjectId).then(
            result => this.callbackTopPerformers(result, false),
            error => this.callbackTopPerformers(<any>error, true))
    }

    callbackTopPerformers(data: any, err: boolean) {
        if (err) {
            this.baseService.showNotification(data, "", 'bg-danger');
        } else {
            this.topPerformers = data
        }
    }

    showGradeDetails(id: any) {
        var data = this.gradeObj['gradeObj'];
        var row = '';
        for(let obj of data) {
            row += '<tr><td>'+obj.start_range + '-'+ obj.end_range +'</td><td>'+obj.cgpa_value+'</td><td>'+obj.grade_name+'</td>'
        }
        var content = '<table class="table"><thead><tr><th>Percentage</th><th>Grade&nbsp;Points</th><th>Grade</th></tr></thead><tbody>'+row+'</tbody></table>'
        this.baseService.enablePopOver('#' + id, 'Grade Details', content, 'bottom')
    }

}
