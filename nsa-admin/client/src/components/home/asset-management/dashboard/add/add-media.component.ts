/**
 * Created by senthil on 28/07/17.
 */
import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls, Constants} from "../../../../../common/index";
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
    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', maxFileSize:1*1024*1024, allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg']});

    attachments: any[] = [];
    detailsForm: any = {};
    uploadId: any;
    attachmentCount: any[] = [];
    uploadCount: any = 0;

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

    addMedia(event: any, details: any) {
        this.detailsForm = details;
        this.attachmentCount = details.image_url != null ? details.image_url : []
        this.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.reset();
        this.baseService.closeOverlay('#addMedia');
    }

    add(event: any) {
        this.baseService.enableLoadingWithMsg('Uploading! Please Wait...')
        this.baseService.enableBtnLoading('saveGallery');
        this.uploadCount = this.uploader.queue.length + this.attachmentCount.length;
        if(this.uploadCount <= 4) {
            this.uploader.uploadAll();
            this.uploader.onCompleteAll = () => {
                this.detailsForm['attachments'] = this.attachments;
                this.saveDashboardImages();
            }
        } else {
            this.baseService.disableBtnLoading('saveGallery');
            this.baseService.disableLoading()
            this.baseService.showNotification("Only 4 photos are allowed", "", 'bg-danger');
        }
    }

    saveDashboardImages() {
        if(this.attachments.length <= 4) {
            this.commonService.put(this.serviceUrls.getSchoolDetails, this.detailsForm).then(
                result => this.saveDashboardImagesCallBack(result, false),
                error => this.saveDashboardImagesCallBack(<any>error, true))
        } else {
            this.baseService.disableLoading()
            this.baseService.disableBtnLoading('saveGallery')
            this.baseService.showNotification("Only 4 photos are allowed", "", 'bg-danger');
        }


    }

    saveDashboardImagesCallBack(result: any, err: boolean) {
        this.attachments.pop();
        if(err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.closeOverlay(null);
            this.baseService.showNotification(result.message, "", 'bg-success');
        }
        this.baseService.disableBtnLoading('saveGallery')
        this.baseService.disableLoading()

    }

    reset() {
        this.refreshAlbum();
        this.uploader.clearQueue();
        this.attachments.pop()
        this.attachments = [];
    }

    refreshAlbum() {
        this.baseService.triggerClick('#albumDetailsRefresh')
    }

}