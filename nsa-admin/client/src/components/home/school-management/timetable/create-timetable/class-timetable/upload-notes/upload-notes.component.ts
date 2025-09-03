/**
 * Created by Cyril on 4/11/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Constants, ServiceUrls, Messages} from "../../../../../../../common/index";
import {ExtCalendarComponent} from "../../../../../common/calendar/ext.calendar.component";
import {BaseService} from "../../../../../../../services/index";
import {DateService} from "../../../../../../../services/common/date.service";
import {FileUploader} from "ng2-file-upload";
import {CommonService} from "../../../../../../../services/common/common.service";
declare var _: any;

@Component({
    selector: 'upload-notes',
    templateUrl: 'upload-notes.html'
})
export class UploadNotesComponent implements OnInit {

    @ViewChild('sms') sms: ElementRef
    @ViewChild('push') push: ElementRef;

    notesObj: any = {};
    classId: any;
    sectionId: any;
    headers: any;
    event: any;
    attachments: any;
    config: any;
    enable: boolean = false;
    UploaderSize: number = 0;

    @ViewChild(ExtCalendarComponent) extCalendar: ExtCalendarComponent

    constructor(private baseService:BaseService,
                private dateService: DateService,
                private serviceUrls:ServiceUrls,
                private commonService: CommonService,
                private messages: Messages,
                private constants:Constants) {
        this.config = this.baseService.config;
    }

    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.timetable + 'notes', maxFileSize:5*1024*1024 ,allowedMimeType: this.constants.allowFileTypes});

    ngOnInit() {
        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        }
        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadFileNotification(item, filter, options)
            return {item, filter, options};
        }
        this.uploader.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.event.timetable_id);
            this.baseService.buildFormDataForUpload(this.event, form);
        };
        this.enable = this.baseService.havePermissionsToEdit(this.constants.TIMETABLE_PERMISSIONS);
    }

    onChange() {
        this.getFileSize(this.uploader.queue);
    }

    getFileSize(queue: any){
       this.UploaderSize =0;
        var self = this;
        setTimeout(function(){
            for (let entry of queue) {
                self.UploaderSize += entry.file.size;
            }
        }, 1000)
    }

    openOverlay(event:any) {
        var obj = JSON.parse(event.target.value);
        this.classId = obj.classId;
        this.sectionId = obj.sectionId;
        this.refreshCalendar(this.notesObj)
        this.commonService.get(this.serviceUrls.getClassPeriods + obj.classId).then(periods => this.callBackClassPeriods(periods))
        this.baseService.openOverlay(event);
    }

    callBackClassPeriods(data: any) {
        this.notesObj.eleAttr = '.fullcalendar';
        this.notesObj.newEvent = '#uploadNotes';
        this.notesObj.newEventButton = '#uploadNewButton';
        this.notesObj.weekEle = '#notesWeekData';
        this.notesObj.eventMenu = '.notes-menu';
        this.notesObj.showSelectHelper = false
        this.notesObj.slots = data;
        this.notesObj.stopOverlap = true;
        this.renderCalendar(this.notesObj, 'week');
    }

    renderCalendar(data: any, view: any) {
        this.extCalendar.enableCalendar(data, view, true)
    }

    getWeekData(event: any) {
        var date = new Date(event.target.value);
        date.setDate(date.getDate() + 1);
        var weekNumber = this.dateService.getWeekNumber(date)
        this.commonService.get(this.serviceUrls.classTimetable + this.classId + '/' + this.sectionId + '?weekNo=' +  weekNumber[1]).then(result => this.callbackWeekData(result))
    }

    uploadEvent(event: any) {
        this.event = JSON.parse(event.target.value);
        this.baseService.openModal('uploadNotes');
    }

    downloadEvent(event: any) {
        var id = 'download';
       this.getNotes(event, id);
    }

    getNotes(event: any, id: any){
        this.attachments = '';
        this.event = JSON.parse(event.target.value);
        this.commonService.post(this.serviceUrls.getfile, this.event).then(notes => this.callBackNotes(notes, id))
    }

    callBackNotes(notes: any, id: any) {
        this.attachments = notes;
        if(_.isEmpty(this.attachments.notesUrl)){
            this.baseService.showNotification(this.messages.noFiles + id, "", 'bg-danger');
        }else if(id == 'download'){
            this.baseService.openModal('downloadNotes');
        }else {
            this.baseService.openModal('deleteNotes');
        }
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    deleteAttchment(event: any){
        var id = 'delete';
        this.getNotes(event, id);
    }

    deleteFile(event: any){
        var currentFile = event.target.value;
        this.attachments['curentFile'] = currentFile;

        this.commonService.deleteMethod(this.serviceUrls.savefile+'/'+ this.attachments.id ,this.attachments)
            .then(data => this.callBackSuccess(data, false))
            .catch(err => this.callBackSuccess(err, true));
    }
    callBackSuccess(result: any, err: boolean){
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, '', 'bg-success');
            if(_.isEmpty(result.data.notesUrl)){
                this.attachments.notesUrl = [];
            }else {
                this.attachments = result.data;
            }

        }

    }


    callbackWeekData(data: any) {
        this.notesObj.events = data;
        this.refreshCalendar(this.notesObj)
    }


    refreshCalendar(data: any) {
        this.extCalendar.refresh(data)
    }

    closeOverlay(event:any) {
        this.baseService.closeModal('uploadNotes');
        this.baseService.closeModal('deleteNotes');
        this.baseService.closeModal('downloadNotes');
        this.baseService.closeOverlay('#upload-files');
    }

    notify() {
        var form = {sms: this.sms.nativeElement.checked, push: this.push.nativeElement.checked}
        this.event.notify = form;
        var notifyTo = {status: 'Sent'};
        this.event.notifyTo = notifyTo;
        this.commonService.post(this.serviceUrls.notesNotifyUrl, this.event).then(
            result => this.callBackNotify(result, false),
            error => this.callBackNotify(<any>error, true))
    }

    callBackNotify(response: any, err: any) {
        if(err) {
            this.baseService.showNotification('Failure!', response.message, 'bg-danger');
        } else {
            this.baseService.showNotification('Success!', response.message, 'bg-success');
            this.uploader.clearQueue();
            this.baseService.closeModal('uploadNotes');
        }
    }
}

