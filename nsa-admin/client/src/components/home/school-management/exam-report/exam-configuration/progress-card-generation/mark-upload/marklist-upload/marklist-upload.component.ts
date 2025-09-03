/**
 * Created by intellishine on 10/21/2017.
 */
import {Component, OnInit, Input, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {FileUploader} from "ng2-file-upload";
import {BaseService} from "../../../../../../../../services/base/base.service";
import {Constants, ServiceUrls} from "../../../../../../../../common/index";
import {CommonService} from "../../../../../../../../services/common/common.service";
declare var _ : any;
declare var $ : any;

@Component({
    selector : 'marklist-upload',
    templateUrl: 'marklist-upload.html'
})
export class MarklistUploadComponent implements OnInit {

    markListUploadObj: any;
    classId: any;
    className: any;
    markListUploadForm: any;
    sectionId: any;
    sectionName: any;
    examId:any;
    downloadUrl: any;
    attachments: any[] =[];

    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.uploadMarkListSheet , allowedMimeType:['application/vnd.ms-excel' ,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']});

    @ViewChild('markListclassSelect') markListclassSelect: ElementRef;
    @ViewChild('markListsectionSelect') markListsectionSelect: ElementRef;
    @ViewChild('markListexamSelect') markListexamSelect: ElementRef;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private http: Http,
                private commonService: CommonService,
                private constants: Constants,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.getClass();
        this.createEventForm();
        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };
        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadNotification(item, filter, options)
            return {item, filter, options};
        }

        this.uploader.onErrorItem = (item, response, status, headers) => {
            var Object = JSON.parse(response);
            this.baseService.disableBtnLoading('save');
               $('#selectFile').val('');
            this.uploader.clearQueue();
            this.baseService.showNotification(Object.data.message, '', 'bg-danger')
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.attachments.push(response)
        }
    }

    createEventForm() {
        this.markListUploadForm = this.fb.group({
            'classId':'',
            'className':'',
            'sectionId':'',
            'sectionName':'',
            'examId':'',
            'examName':'',
            'file':[],
        });
    }

    getClass() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            result => this.classCallback(result, false),
            error => this.classCallback(<any>error, true))
    }

    classCallback(result: any, err: any) {
        this.baseService.enableSelectWithLabel('#markListclass-name', result, this.constants.classObj,'Select Class', null);
    }

    resetForm(){
        this.getClass();
        this.baseService.enableSelectWithEmpty('#markListsection-name', [], this.constants.sectionObj, null);
        this.baseService.enableSelectWithEmpty('#markListexam-name', [], this.constants.examSchedule, null);
        this.attachments = [];
        this.uploader.clearQueue();
        this.itemCancel();
    }

    getSectionByClass() {
        var classObj = this.baseService.extractOptions(this.markListclassSelect.nativeElement.selectedOptions)[0];
        this.sectionId = ''
        this.classId = classObj.id;
        this.className = classObj.name;
        if(this.classId.length > 0) {
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then( sections => this.callBackSections(sections))
        }
    }

    callBackSections(result: any) {
        this.baseService.enableSelectWithLabel('#markListsection-name', result, this.constants.sectionObj, 'Select Section', null);
    }

    getExamsByClassAndSections() {
        this.examId = ''
        var sectionObj = this.baseService.extractOptions(this.markListsectionSelect.nativeElement.selectedOptions)[0];
        this.sectionId = sectionObj.id;
        this.sectionName = sectionObj.name;
        if(this.sectionId.length > 0) {
            this.commonService.get(this.serviceUrls.examScheduleByClassAndSection + this.classId + '/' + this.sectionId).then(
                result => this.examsCallback(result, false),
                error => this.examsCallback(<any>error, true))
        }
    }

    examsCallback(result: any, err: any) {
        this.baseService.enableSelectWithLabel('#markListexam-name', result, this.constants.examSchedule,'Select Exam', null);
    }

    itemCancel(){
        $('#selectFile').val('');
    }

    getDownloadTemplate(){
        var dataFound = this.setValidations();
        if(dataFound){
            var url = this.serviceUrls.getMarkListSheet + this.markListUploadForm._value.examId + '/' + this.classId + '/' + this.sectionId;
            var options = {};
            options['url'] = url;
            options['type'] = 'GET';
            options['dataType'] = 'binary';
            options['headers'] = this.baseService.getHeaderContent();
            this.baseService.downloadFile(options, function(data: any) {
            });
        }
    }


    uploadMarkList(id:any){
        var dataFound = this.setValidations();
        if(dataFound && _.isEmpty(this.uploader.queue)){
            this.baseService.showNotification("Please select attachments","", 'bg-danger');
        } else if(this.markListUploadForm.valid && dataFound){
            this.baseService.enableBtnLoading(id);
            this.uploader.setOptions({ url: this.serviceUrls.uploadMarkListSheet + this.markListUploadForm._value.examId + '/' + this.classId + '/' + this.sectionId});
            this.uploader.uploadAll();
            this.uploader.onCompleteAll = () => {
                if(!_.isEmpty(this.attachments)){
                    this.uploadCallback(this.attachments[0], id);
                }
            }
        }
    }

    uploadCallback(result: any, id: any){
        var formateresult = JSON.parse(result);
        this.baseService.disableBtnLoading(id);
        if(!formateresult.success){
            this.baseService.showNotification(formateresult.data,"", 'bg-danger');
        }else {
            this.baseService.showNotification(formateresult.data, "", 'bg-success');
            this.uploader.clearQueue();
            this.closeOverlay();
            this.resetForm();
            this.baseService.destroyDatatable('.exam-details');
            this.baseService.enableDataTable(this.serviceUrls.getMarkList + '?classId=' + this.classId + '&sectionId=' + this.sectionId + '&id=' + this.examId);

        }
    }

    setValidations():any{
        this.setFormValues();
        var dataFound = false;
        if(!this.markListUploadForm._value.classId) {
            this.baseService.showNotification('Please select class', "", 'bg-danger');
        } else if(!this.markListUploadForm._value.sectionId){
            this.baseService.showNotification('Please select section',"",'bg-danger');
        }else if(!this.markListUploadForm._value.examId){
            this.baseService.showNotification('Please select exam',"", 'bg-danger');
        } else{
            dataFound = true;
        }
        return dataFound;
    }

    setFormValues() {
        var examObj = this.baseService.extractOptions(this.markListexamSelect.nativeElement.selectedOptions)[0];
        this.markListUploadForm._value.classId = this.classId;
        this.markListUploadForm._value.className = this.className;
        this.markListUploadForm._value.sectionId = this.sectionId;
        this.markListUploadForm._value.sectionName = this.sectionName;
        this.markListUploadForm._value.examId = examObj.id;
        this.markListUploadForm._value.examName = examObj.name;
        this.markListUploadForm._value.file = this.uploader.queue;
    }

    show(event: any) {
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.resetForm();
        this.createEventForm();
        this.baseService.closeOverlay('#Marklist-upload');
    }
}