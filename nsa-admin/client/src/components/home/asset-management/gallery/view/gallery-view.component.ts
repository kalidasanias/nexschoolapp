/**
 * Created by senthil on 28/06/17.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {FormBuilder} from "@angular/forms";
import {Constants, ServiceUrls} from "../../../../../common/index";
import { ActivatedRoute } from '@angular/router';
import {AddMediaComponent} from "./add/add-media.component";
declare function removeEditImages(): void


@Component({
    selector: 'gallery-view',
    templateUrl: 'gallery-view.html'
})
export class GalleryViewComponent implements OnInit {

    @ViewChild(AddMediaComponent) addMediaComponent: AddMediaComponent
    private sub: any;
    id: any
    name: any
    featureId: any
    albumDetails: any = [];
    selectedIds: any[] = []
    seletedImageIds: any[] = []
    seletedVideoIds: any[] = []
    type: any = ''
    enable : boolean = false;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private constants: Constants,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.name = params['name'];
            this.enable = this.baseService.havePermissionsToEdit(this.constants.GALLERY_PERMISSIONS)
        });
        this.sub = this.route.queryParams.subscribe(params => {
            this.featureId = params['fi']
        });
        this.baseService.enableAppJs();
        this.baseService.selectStyle();
        this.getAlbumDetails();
    }

    getAlbumDetails() {
        this.commonService.get(this.serviceUrls.galleryAlbumDetails + this.id  + "?type=" + this.type).then(
            result => this.albumDetailsCallback(result, false),
            error => this.albumDetailsCallback(<any>error, true))
    }

    albumDetailsCallback(result: any, err: boolean) {
        if(err) {

        } else {
            this.albumDetails = result
            setTimeout(() => {
                removeEditImages();
            }, 100);

        }
    }

    AddMedia(event: any) {
        this.addMediaComponent.addMedia(event, this.id)
    }

    refreshAlbums() {
        this.getAlbumDetails();
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
            this.baseService.enableLoadingWithMsg('Deleting...')
            this.commonService.deleteMethod(this.serviceUrls.galleryAlbumDetails, {seletedVideoIds: this.seletedVideoIds, selectedIds: this.selectedIds, seletedImageIds: this.seletedImageIds}).then(
                result => this.deleteCallback(result, false),
                error => this.deleteCallback(<any>error, true))
        }
    }

    deleteCallback(result: any, err: boolean) {
        if(err){
            this.baseService.showNotification(result,"", 'bg-danger');
        }else {
            this.baseService.showNotification(result.message, "", 'bg-success');
        }
        this.getAlbumDetails();
        this.baseService.disableLoading()
    }

    filter(event: any) {
        this.type = event.target.id;
        this.getAlbumDetails()
    }


}