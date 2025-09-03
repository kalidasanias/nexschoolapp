import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {BaseService} from "../../../../../../../../services/base/base.service";
import {FormBuilder} from "@angular/forms";
import {ServiceUrls} from "../../../../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../../../../services/common/common.service";
import {Constants} from "../../../../../../../../common/constants/constants";
declare var $: any;

@Component({
    selector : 'mark-upload-config',
    templateUrl: 'mark-upload-config.html'
})

export class MarkUploadConfigComponent implements OnInit {
    classId: any
    sectionId: any
    className: any
    sectionName: any
    examId: any
    modalId: any;
    columns: any[] = [];
    columnDef: any[] = [];
    data: any
    rowData: any[] = [];
    subjects: any[] = []
    visibility: boolean = false;
    edit: boolean = false
    publish: boolean = false
    feature: any;

    @ViewChild('classSelect') classSelect: ElementRef;
    @ViewChild('sectionSelect') sectionSelect: ElementRef;
    @ViewChild('examSelect') examSelect: ElementRef;
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Progress Card Generation');
        this.getClass();
    }

    getClass() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            result => this.classCallback(result, false),
            error => this.classCallback(<any>error, true))
    }

    classCallback(result: any, err: any) {
        this.baseService.enableSelectWithLabel('#class-name', result, this.constants.classObj,'Select Class', null);
    }

    getSectionByClass() {
        this.emptyData();
        this.sectionId = ''
        var classObj = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)[0];
        this.classId = classObj.id;
        this.className = classObj.name
        if(this.classId.length > 0) {
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then( sections => this.callBackSections(sections))
            this.baseService.removeHideClass('#section-name');
        } else {
            this.baseService.addHideClass('#section-name');
        }
    }

    callBackSections(result: any) {
        this.baseService.enableSelectWithLabel('#section-name', result, this.constants.sectionObj, 'Select Section', null);
    }

    getExamsByClassAndSections() {
        this.emptyData();
        this.examId = ''
        var sectionObj = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0];
        this.sectionId = sectionObj.id;
        this.sectionName = sectionObj.name;
        if(this.sectionId.length > 0) {
            this.commonService.get(this.serviceUrls.examScheduleByClassAndSection + this.classId + '/' + this.sectionId).then(
                result => this.examsCallback(result, false),
                error => this.examsCallback(<any>error, true))
        }
    }

    examsCallback(result: any, err: any) {
        this.baseService.enableSelectWithEmpty('#exam-name', result, this.constants.examSchedule, null);
    }

    getUsersByClassAndSection() {
        this.emptyData();
        this.examId = this.baseService.extractOptions(this.examSelect.nativeElement.selectedOptions)[0].id;
        if(this.examId.length > 0) {
            this.commonService.get(this.serviceUrls.getUsersByClassAndSection +  this.examId +  '/' + this.classId + '/' + this.sectionId).then(
                result => this.usersCallback(result, false),
                error => this.usersCallback(<any>error, true))
        }
    }

    usersCallback(result: any, err: boolean) {
        var headings = this.formatHeadings(result.headings)
        this.columns = headings.cols
        this.columnDef = headings.colDef
        if(this.columnDef && this.columns) {
            this.rowData = this.getRowData(result.users)
            if(this.rowData) {
                this.baseService.setTitle(this.className + ' - ' + this.sectionName + ' Mark Sheet');
                this.baseService.enableMarkUploadDataTable('.mark-upload', this.columns, this.columnDef, this.rowData);
                this.visibility = true
            }
        }

        this.baseService.disableLoading()
    }

    formatHeadings(headings: any) {
        var cols = []
        var colDef = []
        for(var key in headings) {
            var columnObj = headings[key];
            cols.push({ "mDataProp": columnObj.name})
            colDef.push({aTargets: [columnObj.priority], sTitle: columnObj.label, className: columnObj.label != "Name" ? "th-title": ""})
        }
        if(!this.publish) {
            cols.push({ "mDataProp": 'action'})
            colDef.push({aTargets: colDef.length, responsivePriority: 1, sTitle: 'Action'})
        }

        return {cols: cols, colDef: colDef}
    }

    getRowData(users: any) {
        var rowData = []
        for(var key in users) {
            var obj = users[key];
            var row = {}
            for (var objectKey in obj) {
                if(objectKey != "subjects") {
                    row[objectKey] = obj[objectKey];
                } else {
                    var subjects = obj[objectKey];
                    for(var objKey in subjects) {
                        var value = subjects[objKey]
                        if(objKey == 'Total' || this.publish) {
                            row[objKey] = value
                        } else {
                            this.subjects.push(objKey)
                            row[objKey] = "<input type='text' name='exam1' class='form-control inputbox-datatable-size' value= " + value +"><span style='display: none;'>"+ value +"</span>"

                        }
                    }
                }
            }
            row['action'] = '<button type="button" class="btn btn-primary btn-xs btn-ladda btn-ladda-spinner update-mark" data-size="xs" data-style="zoom-out" data-spinner-size="20"><span class="ladda-label">Update</span></button>'
            rowData.push(row)
        }

        return rowData;
    }


    show(event: any) {
        this.edit = false
        this.publish = false
        this.sectionId = ''
        this.classId = ''
        this.examId = ''
        this.getClass();
        this.emptyData();
        this.baseService.openOverlay(event);
    }

    editMarkSheet(event: any) {
        this.baseService.enableLoadingWithMsg('')
        var object = JSON.parse(event.target.value)
        if(object) {
            this.edit = true
            this.publish = false
            this.setValues(object)
            this.emptyData();
            if(this.examId.length > 0) {

                this.commonService.get(this.serviceUrls.getUsersByClassAndSection +  this.examId +  '/' + this.classId + '/' + this.sectionId).then(
                    result => this.usersCallback(result, false),
                    error => this.usersCallback(<any>error, true))
            }
            this.baseService.openOverlay(event);
        }
    }

    setValues(object: any) {
        this.sectionId = object.sectionId
        this.classId = object.classId
        this.className = object.className
        this.sectionName = object.sectionName
        this.examId = object.examScheduleId
    }


    publishMarkSheet(event: any) {
        var object = JSON.parse(event.target.value)
        this.publish = true
        this.getFeatureChannelConfiguration();
        if(object) {
            this.edit = true
            this.setValues(object)
            this.emptyData();
            if(this.examId.length > 0) {
                this.commonService.get(this.serviceUrls.getUsersByClassAndSection +  this.examId +  '/' + this.classId + '/' + this.sectionId).then(
                    result => this.usersCallback(result, false),
                    error => this.usersCallback(<any>error, true))
            }
            this.baseService.openOverlay(event);
        }
    }

    closeOverlay() {
        this.emptyData();
        this.baseService.destroyDatatable('.exam-details')
        this.baseService.enableDataTable(this.serviceUrls.getMarkList);
        this.baseService.closeOverlay("#mark-upload-config");
    }

    uploadMark(event: any) {
        var obj = JSON.parse(event.target.value)
        var data = obj.data;
        var newObj = {}
        var subjetSet = new Set(this.subjects);
        var subjectMarks = {}
        for (var objectKey in data) {
           if(subjetSet.has(objectKey)) {
                var html = $.parseHTML(data[objectKey]);
                subjectMarks[objectKey] = html[0].value;
            } else if(objectKey == 'Total') {
                subjectMarks[objectKey] = data[objectKey];
            } else {
                newObj[objectKey] = data[objectKey];
            }
        }
        newObj['subjects'] = subjectMarks;
        newObj['sectionName'] = this.sectionName
        var userSubjects = newObj['userSubMarkDetails']
        for (var objectKey in userSubjects) {
            var subject = userSubjects[objectKey];
            for (var subjectKey in subject) {
                if(subjectMarks.hasOwnProperty(subjectKey)) {
                    console.log(message)
                    if(subject['maxMarks'] >= parseInt(subjectMarks[subjectKey])) {
                        subject['marksObtained'] = subjectMarks[subjectKey]
                    } else {
                        var message = "Entered Marks is Invalid in " + subject['subjectName']
                        this.baseService.showNotification("Error", message, 'bg-danger');


                        this.baseService.disableBtnLoading(obj.row)
                        return;
                    }

                }
            }
        }
        this.commonService.put(this.serviceUrls.updateMarks +  newObj['marklistDetailId'], newObj).then(
            result => this.updateCallback(result, obj,false),
            error => this.updateCallback(<any>error, obj, true))
    }

    updateCallback(result: any, obj: any, err: any) {
       this.baseService.disableBtnLoading(obj.row)
    }

    publisMarkList(event: any) {
        var notify = {}
        notify['sms'] = this.sms.nativeElement.checked;
        notify['email'] = this.email.nativeElement.checked;
        notify['push'] = this.push.nativeElement.checked;

        this.baseService.enableBtnLoading('publishButton')
        var table =  $('.mark-upload').DataTable();
        var resultObj: any[] = []
        var subjetSet = new Set(this.subjects);
        var subjectMarks = {}
        table.rows().every( function () {
            var row = this.data()
            var newObj = {}
            for (var objectKey in row) {
                if(subjetSet.has(objectKey)) {
                    var html = $.parseHTML(row[objectKey]);
                    subjectMarks[objectKey] = html[0].value;
                } else if(objectKey == 'Total') {
                    subjectMarks[objectKey] = row[objectKey];
                } else {
                    newObj[objectKey] = row[objectKey];
                }
            }
            newObj['subjects'] = subjectMarks;
            var userSubjects = newObj['userSubMarkDetails']
            for (var objectKey in userSubjects) {
                var subject = userSubjects[objectKey];
                for (var subjectKey in subject) {
                    if(subjectMarks.hasOwnProperty(subjectKey)) {
                        subject['marksObtained'] = subjectMarks[subjectKey]
                    }
                }
            }
            newObj['status'] = true
            newObj['notify'] = notify;
            resultObj.push(newObj)
        });
        this.publishEvent(resultObj)
    }

    publishEvent(obj: any) {
        if(obj.length > 0) {
            var id = obj[0]['marklistId']
            this.commonService.put(this.serviceUrls.publishMarks +  id, obj).then(
                result => this.publishEventCallback(result,false),
                error => this.publishEventCallback(<any>error, true))
        }
    }

    publishEventCallback(result: any, err: any) {
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.closeOverlay();
            this.baseService.showNotification(result.message, "", 'bg-success');
        }
        this.baseService.disableBtnLoading('publishButton');
    }

    emptyData() {
        if(this.visibility) {
            this.baseService.destroyDatatable('.mark-upload');
            $('.mark-upload').empty();
            this.visibility = false
        }
        this.subjects = []
        this.rowData = []
        this.columnDef = []
        this.columns = []
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

}

