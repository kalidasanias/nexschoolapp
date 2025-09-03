/**
 * Created by senthil on 28/06/17.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {FormBuilder} from "@angular/forms";
import {Constants, ServiceUrls} from "../../../../common/index";
import { ActivatedRoute } from '@angular/router';
import {AddMediaComponent} from "./add/add-media.component";
declare function removeEditImages(): void


@Component({
    templateUrl: 'dashboard-gallery.html'
})
export class DashboardGalleryComponent implements OnInit {

    @ViewChild(AddMediaComponent) addMediaComponent: AddMediaComponent

    private sub: any;
    id: any
    name: any
    featureId: any
    schoolDetails: any = [];
    images: any = [];
    selectedIds: any[] = []
    seletedImageIds: any[] = []
    seletedVideoIds: any[] = []
    enable: boolean = false;

    type: any = ''

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private constants: Constants,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Dashboard Photos');
        this.baseService.enableAppJs();
        this.baseService.selectStyle();
        this.getSchoolDetails();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.GALLERY_PERMISSIONS)
    }

    getSchoolDetails() {
        this.commonService.get(this.serviceUrls.getSchoolDetails).then(
            result => this.schoolDetailsCallback(result, false),
            error => this.schoolDetailsCallback(<any>error, true))
    }

    schoolDetailsCallback(result: any, err: boolean) {
        if(err) {

        } else {
            this.schoolDetails = result;
            this.images = result.image_url != null ? result.image_url : [];
            setTimeout(() => {
                removeEditImages();
            }, 100);

        }
    }

    AddMedia(event: any) {
        if(this.images.length < 4) {
            this.addMediaComponent.addMedia(event, this.schoolDetails);
        } else {
            this.baseService.showNotification("Only 4 photos are allowed", "", 'bg-danger');
        }

    }

    refreshDetails() {
        this.getSchoolDetails();
    }

    delete_request(event: any) {
        var objs = JSON.parse(event.target.nextElementSibling.value)
        this.selectedIds = objs.seletedObjIds
        this.seletedImageIds = objs.seletedImageIds
        this.seletedVideoIds = objs.seletedVideoIds
        if(this.selectedIds) {
            this.baseService.showWarning();
        }
    }

    delete(event: any) {
        if(this.selectedIds) {
            this.schoolDetails['selectedImageIds'] = this.seletedImageIds;
            this.baseService.enableLoadingWithMsg('Deleting...')
            this.commonService.put(this.serviceUrls.getSchoolDetails, this.schoolDetails).then(
                result => this.deleteCallback(result, false),
                error => this.deleteCallback(<any>error, true))
        }
    }

    deleteCallback(result: any, err: boolean) {
        this.getSchoolDetails();
        this.baseService.disableLoading()
    }

}