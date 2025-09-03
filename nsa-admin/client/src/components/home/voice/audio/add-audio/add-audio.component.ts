/**
 * Created by bharatkumarr on 25/04/17.
 */

import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {FileUploader} from "ng2-file-upload";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService, TransportService } from '../../../../../services/index';
import { Constants, ServiceUrls } from '../../../../../common/index';
import {isNullOrUndefined} from "util";
import {ValidationService} from "../../../../../services/validation/validation.service";
import {CommonService} from "../../../../../services/common/common.service";
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";

@Component({
    selector: 'add-audio',
    templateUrl: 'add-audio.html'
})

export class AddAudioComponent implements OnInit {

    attachments: any[] = [];
    uploadId: any;
    attachmentsForm: any = {};
    audios: any[]= [];
    show: any;
    play: any;
    private tick: number = 0;
    private subscription: Subscription;
    private audioRecorder: any;
    private showPlayer: boolean;
    private fileName: string;
    private audioFile: any;
    private uploadFile: any;
    private singleUpload: boolean = false;
    public uploaderMobi:FileUploader = new FileUploader({url: this.serviceUrls.audioUrl + '/upload' , allowedMimeType: ['audio/mp3', 'audio/wav']});
    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', allowedMimeType: ['audio/mp3', 'audio/wav']});

    constructor(private baseService: BaseService, private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private constants: Constants,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.showPlayer = false;
        this.audioRecorder = this.baseService.getAudioRecorder();
        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };

        this.uploader.onErrorItem = (item, response, status, headers) => {
            var Object = JSON.parse(response);
         this.baseService.showNotification(Object.data.message, '', 'bg-danger')
        };

        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadNotification(item, filter, options)
            return {item, filter, options};
        }

        this.uploader.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.uploadId = Math.floor(Math.random() * 1000000000));
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.attachments.push(this.baseService.extractAttachment(response));
            this.Mobiupload();
        };

        this.uploaderMobi.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploaderMobi.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };
        this.uploaderMobi.onBuildItemForm = (item, form) => {
            form.append('download_link', this.attachments[0].key);
            form.append('file_name', this.attachments[0].name);
        };
        this.uploaderMobi.onErrorItem = (item, response, status, headers) => {
            var Object = JSON.parse(response);
            this.baseService.showNotification(Object.data.message, '', 'bg-danger')
        };
        this.uploaderMobi.onSuccessItem = (item, response, status, headers) => {
            var result = JSON.parse(response);
            this.attachments.pop();
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.closeOverlay();
            this.baseService.dataTableReload('datatable-audios');
            this.uploader.clearQueue();
            this.uploaderMobi.clearQueue();
        }
    }


    startInterval(play: any) {
        if(this.fileName !== undefined && this.fileName){
            if (play) {
                this.audioRecorder.start();
                let timer = TimerObservable.create(0, 1000);
                this.subscription = timer.subscribe(t => {
                    this.tick++;
                });
            } else {
                this.stopRecorder();
            }
        }else {
            this.play = null;
            this.baseService.showNotification('Please Enter file Name', '', 'bg-danger');
        }
    }

    onChange(event: any) {
        var target = event.target || event.srcElement;
        this.uploadFile = target.files;
    }

    save(){
        if(this.show == undefined){
            this.baseService.showNotification('Please choose Browse file or record file', '', 'bg-danger');
        } else if(this.show === 'record' && (this.fileName == undefined || !this.fileName)){
            this.baseService.showNotification('Please Enter file Name', '', 'bg-danger');
        } else if(this.uploadFile == undefined && this.audioFile == undefined){
            this.baseService.showNotification('Please choose audio file (mp3 or wav) or record audio', '', 'bg-danger');
        } else {
            this.uploader.clearQueue();
            if (this.show == 'browse' ) { // browse
                this.uploader.addToQueue(this.uploadFile);
                this.uploaderMobi.addToQueue(this.uploadFile);
                this.uploader.uploadAll();
            } else {
                this.uploader.addToQueue(this.audioFile);
                this.uploaderMobi.addToQueue(this.audioFile);
                this.uploader.uploadAll();
            }
        }

    }

    Mobiupload(){
        this.uploaderMobi.uploadAll();
        this.uploaderMobi.onCompleteAll = () => {
        }
    }

    addAttachements(data: any) {
        this.commonService.post(this.serviceUrls.audioUrl + '/upload' , data).then(
            result => this.addAttachementsCallback(result, false),
            error => this.addAttachementsCallback(<any>error, true))
    }

    addAttachementsCallback(result: any , err: any){
        if(err){
            this.baseService.showNotification(result,"", 'bg-danger');
        }else {
            this.attachments.pop();
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.closeOverlay();
            this.baseService.dataTableReload('datatable-audios');
            this.uploader.clearQueue();
        }
    }

    stopRecorder() {
        this.audioRecorder.stop();
        this.baseService.getRecordedAudio(this.audioRecorder, 'player', this.successRecord.bind(this), this.errorRecord.bind(this));
        this.tick = 0;
        this.showPlayer = true;
        this.ngOnDestroy();
    }

    successRecord(blob: Blob) {
        var audioFile: any = blob;
        audioFile.lastModifiedDate = new Date();
        audioFile.name = this.fileName + '.mp3';
        this.audioFile =  [<File> audioFile];
    }

    errorRecord(e: any) {
        this.baseService.showNotification('Recording Failed - Please make sure microphone enabled in your browser settings !!!', "", 'bg-danger');
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    resetForm(){
        this.ngOnDestroy();
        this.tick = null;
        this.show = null;
        this.play = null;
        this.showPlayer = false;
        this.uploader.clearQueue();
        this.fileName = undefined;
        this.audioFile = undefined;
        this.uploadFile = undefined;
        this.audios = [];
    }

    openOverlay(event: any) {
        this.resetForm();
        this.baseService.addChecked('#browse');
      this.show = "browse";
      this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.resetForm();
        this.baseService.closeOverlay('#addAudio');
    }
}
