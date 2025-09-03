/**
 * Created by senthil on 28/07/17.
 */
import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {CommonService} from "../../../../../../services/common/common.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls, Constants} from "../../../../../../common/index";
import {FileUploader} from "ng2-file-upload";

@Component({
    selector: 'add-media',
    templateUrl: 'add-media.html'
})
export class AddMediaComponent implements OnInit {
    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }
    videoTypes: any[] = ['video/mp4', 'video/avi', 'video/flv', 'video/mp4', 'video/wmv','video/3gpp']
    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', maxFileSize:10*1024*1024, allowedMimeType: ['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/avi', 'video/flv', 'video/mp4', 'video/wmv', 'video/3gpp']});

    attachments: any[] = [];
    attachmentsForm: any = {};
    uploadId: any

    ngOnInit() {
        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
            if (this.baseService.isContainsKey(this.videoTypes, item.file.type)) {
                var url = item.url + '/video'
                item.url = url
            }
        }
        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadNotification(item, filter, options)
            return {item, filter, options};
        }

        this.uploader.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.uploadId);
        };
        this.uploader.onSuccessItem = (item, response, status, headers) => {
            console.log('response', JSON.parse(response))
            if (this.baseService.isContainsKey(this.videoTypes, item.file.type)) {
                this.attachments.push(this.baseService.extractVideoAttachment(response))
            } else {
                this.attachments.push(this.baseService.extractAttachment(response))
            }
        }
    }

    openOverlay(event: any) {
        this.baseService.openOverlay(event)
    }

    addMedia(event: any, id: any) {
        this.uploadId = id
        this.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.reset();
        this.baseService.closeOverlay('#addMedia');
    }

    add(event: any) {
        this.baseService.enableLoadingWithMsg('Uploading! Please Wait...')
        this.baseService.enableBtnLoading('saveGallery');
        this.uploader.uploadAll();
        this.uploader.onCompleteAll = () => {
            this.attachmentsForm['id'] = this.uploadId;
            this.attachmentsForm['attachments'] = this.attachments;
            this.saveAlbumDetails();
        }
    }

    saveAlbumDetails() {
        this.commonService.post(this.serviceUrls.galleryAlbumDetails, this.attachmentsForm).then(
            result => this.saveAlbumDetailsCallBack(result, false),
            error => this.saveAlbumDetailsCallBack(<any>error, true))
    }

    saveAlbumDetailsCallBack(result: any, err: boolean) {
        this.attachments.pop();
        if(err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.closeOverlay(null);
            this.baseService.showNotification('Media Added Successfully', "", 'bg-success');
        }
        this.baseService.disableBtnLoading('saveGallery')
        this.baseService.disableLoading()

    }

    reset() {
        this.refreshAlbum();
        this.uploader.clearQueue();
        this.attachments.pop()
    }

    refreshAlbum() {
        this.baseService.triggerClick('#albumDetailsRefresh')
    }

}