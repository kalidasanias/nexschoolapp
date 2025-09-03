/**
 * Created by Sai Deepak on 15-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../../../common/index";
import {CommonService} from "../../../../../../../../services/common/common.service";
declare var jQuery: any;
declare var _: any;

@Component({
    selector: 'print-progress-card',
    templateUrl: 'print-progress-card.html'
})

export class PrintProgressCardComponent implements OnInit {


    classId: any;
    classes: any;
    terms: any;
    sectionId: any;
    className: any;
    termId: any;
    termName: any;
    sectionName: any;
    examId: any;
    modalId: any;
    columns: any[] = [];
    columnDef: any[] = [];
    data: any;
    rowData: any[] = [];
    subjects: any[] = [];
    visibility: boolean = false;
    edit: boolean = false
    publish: boolean = false
    feature: any;

    @ViewChild('classSelect') classSelect: ElementRef;
    @ViewChild('sectionSelect') sectionSelect: ElementRef;
    @ViewChild('examSelect') examSelect: ElementRef;
    @ViewChild('termSelect') termSelect: ElementRef;
    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChild('date') date: ElementRef;
    @ViewChild('singleSection') singleSection: ElementRef;
    @ViewChild('sms') sms: ElementRef;
    @ViewChild('email') email: ElementRef;
    @ViewChild('push') push: ElementRef;
    @ViewChild('presntees') presntees: ElementRef;
    @ViewChild('absentees') absentees: ElementRef;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.getClass();
        this.getActiveClasses();
    }

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
    }

    getClass() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            result => this.classCallback(result, false),
            error => this.classCallback(<any>error, true))
    }

    classCallback(result: any, err: any) {
        this.baseService.enableSelectWithLabel('#class-name-select', result, this.constants.classObj,'Select Class', null);
    }

    closeOverlay() {
        this.emptyData();
        if(this.visibility) {
            this.baseService.destroyDatatable('.mark-print');
            $('.mark-print').empty();
            this.visibility = false
        }
        this.baseService.closeOverlay("#print-progress-card");
    }

    getSectionByClass() {
        this.emptyData();
        this.sectionId = '';
        var classObj = this.baseService.extractOptions(this.classSelect.nativeElement.selectedOptions)[0];
        this.classId = classObj.id;
        this.className = classObj.name
        if(this.classId.length > 0) {
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then( sections => this.callBackSections(sections))
            this.baseService.removeHideClass('#section-name-select');
        } else {
            this.baseService.addHideClass('#section-name-select');
        }
    }

    callBackSections(result: any) {
        this.baseService.enableSelectWithLabel('#section-name-select', result, this.constants.sectionObj, 'Select Section', null);
    }


    getTermByExam() {
        this.emptyData();
        var examObj = this.baseService.extractOptions(this.examSelect.nativeElement.selectedOptions)[0].id;
        this.examId = examObj;
        if(this.examId.length > 0) {
            this.commonService.get(this.serviceUrls.getAllTerms).then( terms => this.callBackTerms(terms))
        }
    }

    callBackTerms(result: any) {
        this.terms = result;
        this.baseService.enableSelectWithLabel('#term-name-select', result, this.constants.termObj, 'Select Term', null);
    }

    getExamsByClassAndSections() {
        this.emptyData();
        this.examId = ''
        this.termId = ''
        var sectionObj = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0];
        this.sectionId = sectionObj.id;
        this.sectionName = sectionObj.name;
        if(this.sectionId.length > 0) {
            this.commonService.get(this.serviceUrls.examScheduleByClassAndSection + this.classId + '/' + this.sectionId + '/' + this.termId).then(
                result => this.examsCallback(result, false),
                error => this.examsCallback(<any>error, true))
        }
    }

    examsCallback(result: any, err: any) {
        this.baseService.enableSelectWithEmpty('#exam-name-select', result, this.constants.examSchedule, null);
    }

    getUsersByClassAndSection() {
        this.emptyData();
        this.termId = this.baseService.extractOptions(this.termSelect.nativeElement.selectedOptions)[0].id;
        this.examId = this.baseService.extractOptions(this.examSelect.nativeElement.selectedOptions)[0].id;
        this.publish = true;
        if(this.examId.length > 0) {
            this.commonService.get(this.serviceUrls.getUsersByClassAndSection +  this.examId +  '/' + this.classId + '/' + this.sectionId ).then(
                result => this.usersCallback(result, false),
                error => this.usersCallback(<any>error, true))
            this.baseService.removeDisabled('#generateReport1');
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
                this.baseService.enableMarkUploadDataTable('.mark-print', this.columns, this.columnDef, this.rowData);
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
            colDef.push({aTargets: colDef.length, "bVisible": false, responsivePriority: 1, sTitle: 'Action'})
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
                            row[objKey] = "<span>"+ value +"</span>"

                        }
                    }
                }
            }
            /*row['action'] = '<a class="icon-primary marklist-stat"><i class="fa fa-print fa-lg"></i></a>'*/
            rowData.push(row)
        }

        return rowData;
    }

    emptyData() {
        if(this.visibility) {
            this.baseService.destroyDatatable('.mark-print');
            $('.mark-print').empty();
            this.visibility = false
        }
        this.subjects = []
        this.rowData = []
        this.columnDef = []
        this.columns = []
    }


    show(event:any) {
        this.baseService.enableLoadingWithMsg('');
        this.getClass();
        this.getActiveClasses();
        this.baseService.enableSelectWithEmpty('#class-name-select', this.classes, this.constants.classObj, null);
        this.edit = false;
        this.publish = false;
        this.sectionId = '';
        this.classId = '';
        this.examId = '';
        this.termId = '';
        this.baseService.addDisabled('#generateReport1');
        this.baseService.openOverlay(event);
        this.baseService.disableLoading()
    }


    printProgressCard (event: any) {
        this.baseService.enableLoadingWithMsg('')
        var termObj1 = this.baseService.extractOptions(this.termSelect.nativeElement.selectedOptions)[0];
        var termObj = _.filter(this.terms, {"id" : termObj1.id });
        this.commonService.post(this.serviceUrls.printPC +  '/' +  this.examId +  '/' + this.classId + '/' + this.sectionId + '?classId=' + this.classId + '&sectionId=' + this.sectionId + '&startDate=' + termObj[0].startDate  + '&endDate=' + termObj[0].endDate , termObj[0]).then(report => this.callBackReport(report));
    }

    callBackReport(report: any) {
        this.baseService.enableLoadingWithMsg('Report Card is Generating')
        this.baseService.rportData(report);
        this.baseService.disableLoading()
    }
}