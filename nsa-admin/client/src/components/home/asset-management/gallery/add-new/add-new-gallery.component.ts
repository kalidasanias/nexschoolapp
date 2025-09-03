/**
 * Created by Deepa on 6/21/2017.
 */
import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {TreeService} from "../../../../../services/tree/tree.service";
import {FileUploader} from "ng2-file-upload";

@Component({
    selector: 'add-new-gallery',
    templateUrl: 'add-new-gallery.html'
})
export class AddNewGalleryComponent implements OnInit {
    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private treeService: TreeService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    @ViewChild('categorySelect') categorySelect: ElementRef;

    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', maxFileSize:10*1024*1024, allowedMimeType: ['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/avi', 'video/flv', 'video/mp4', 'video/wmv', 'video/3gpp']});

    galleryForm: any
    taxanomy: any[] = [];
    data: any[] = []
    hash: any[]
    selectedNodes: any[] = []
    classes: any[] = []
    userType: any[] = []
    categories: any
    attachments: any[] = [];
    attachmentsForm: any = {};
    uploadId: any
    selectedCategories: any = []
    edit: boolean
    editObj: any = {}
    videoTypes: any[] = ['video/mp4', 'video/avi', 'video/flv', 'video/mp4', 'video/wmv', 'video/3gpp']

    ngOnInit() {
        this.createForm()
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

    addNewGallery(event: any) {
        this.commonService.get(this.serviceUrls.eventType).then(
            result => this.categoryCallback(result, false),
            error => this.categoryCallback(<any>error, true))
        this.openOverlay(event);
    }

    categoryCallback(result: any, err: any) {
        this.baseService.enableMultiSelectAll('.select-category', result, this.constants.eventTypeObj, this.selectedCategories);
    }

    closeOverlay(event:any) {
        this.createForm();
        this.baseService.closeOverlay('#addNewGallery');
    }

    createForm() {
        this.selectedCategories = [];
        this.uploader.clearQueue();
        this.galleryForm =  this.fb.group({
            'albumName': ['', Validators.required],
            'description': [''],
            'category': [''],
        })
        setTimeout(() => {
            this.edit = false;
        }, 500)
    }

    save(event: any) {
        if(this.setValidations()) {
            this.baseService.enableLoadingWithMsg('Uploading! Please Wait...')
            this.baseService.enableBtnLoading('saveGallery');
            this.galleryForm._value.category = this.categories;
            this.galleryForm._value.numberOfFiles = this.uploader.queue.length
            this.commonService.post(this.serviceUrls.galleryAlbum, this.galleryForm._value).then(
                result => this.saveCallBack(result, false),
                error => this.saveCallBack(<any>error, true))
        }
    }

    update(event: any) {
        if(this.setValidations()) {
            this.baseService.enableBtnLoading('updateGallery');
            this.galleryForm._value.category = this.categories;
            this.commonService.put(this.serviceUrls.galleryAlbum + this.editObj.album_id, this.galleryForm._value).then(
                result => this.updateCallBack(result, false),
                error => this.updateCallBack(<any>error, true))
        }
    }

    updateCallBack(result: any, err: boolean) {
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.refreshAlbum();
            this.closeOverlay(null);
            this.baseService.showNotification(result.message, "", 'bg-success');
        }
        this.baseService.disableBtnLoading('saveGallery')

    }

    saveCallBack(result: any, err: boolean) {
        this.uploadId = result.id;
        this.uploader.onCompleteAll = () => {
            this.attachmentsForm['id'] = result.id;
            this.attachmentsForm['attachments'] = this.attachments;
            this.saveAlbumDetails();
        }
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.uploader.uploadAll();
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
            this.refreshAlbum();
            this.uploader.clearQueue();
            this.attachments.pop()
            this.closeOverlay(null);
            this.baseService.showNotification(result.message, "", 'bg-success');
        }
        this.baseService.disableBtnLoading('saveGallery')
        this.baseService.disableLoading()

    }

    setValidations() : any {
        var dataFound = false;
        this.categories = this.baseService.extractOptions(this.categorySelect.nativeElement.selectedOptions);
        if(this.categories.length < 1) {
            this.baseService.showNotification(this.constants.selectCategory, "", this.constants.j_danger);
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    refreshAlbum() {
        this.attachments = [];
        this.baseService.triggerClick('#albumRefresh')
    }

    editGallery(event: any, obj: any) {
        this.editObj = obj
        this.setFormValues(obj)
        this.edit = true
        this.commonService.get(this.serviceUrls.eventType).then(
            result => this.categoryCallback(result, false),
            error => this.categoryCallback(<any>error, true))

        this.openOverlay(event);
    }

    setFormValues(obj: any) {
        this.selectedCategories = this.baseService.getObjectValues(JSON.parse(obj.category_objs), 'id');
        this.galleryForm =  this.fb.group({
            'albumName': [obj.name, Validators.required],
            'description': [obj.description || ''],
            'category': [''],
        })
    }
}