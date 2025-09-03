/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {AddNewGalleryComponent} from "./add-new/add-new-gallery.component";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls} from "../../../../common/constants/service.urls";
import { URLSearchParams } from '@angular/http';
import {Constants} from "../../../../common/constants/constants";

declare function flex(): void

@Component({
    templateUrl: 'gallery.html'
})
export class GalleryComponent implements OnInit {
    @ViewChild(AddNewGalleryComponent) addNewGalleryComponent: AddNewGalleryComponent
    enable:boolean = false;
    albums: any
    categories: any = []
    params: any = ''
    orderBy: any = 'desc'
    constructor(private baseService: BaseService,
                private constants: Constants,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }
    ngOnInit() {
        this.baseService.setTitle('NSA - Gallery');
        this.enable = this.baseService.havePermissionsToEdit(this.constants.GALLERY_PERMISSIONS);
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableLightGallery();
        this.getAlbums();
        this.getCategories();
    }

    addNewGallery(event: any) {
        this.addNewGalleryComponent.addNewGallery(event)
    }

    getAlbums() {
        var param = new URLSearchParams();
        param.append('category', this.params);
        param.append('orderBy', this.orderBy);
        this.commonService.get(this.serviceUrls.galleryAlbum + '?' + param).then(
            result => this.albumCallback(result, false),
            error => this.albumCallback(<any>error, true))
    }

    getCategories() {
        this.commonService.get(this.serviceUrls.eventType).then(
            result => this.categoryCallback(result, false),
            error => this.categoryCallback(<any>error, true))
    }

    categoryCallback(result: any, err: boolean) {
        this.categories = result;
    }

    albumCallback(result: any, err: boolean) {
        this.albums = result;
        setTimeout(()=> {
            flex();
        }, 100)
    }

    refreshAlbums() {
        this.params = ''
        this.getAlbums();
    }

    categoryFilter(event: any) {
        this.params = event.target.id;
        this.getAlbums();
    }

    sortFilter(event: any) {
        this.orderBy = event.target.id
        this.getAlbums();

    }
}
