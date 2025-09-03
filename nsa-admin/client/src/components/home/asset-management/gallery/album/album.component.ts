/**
 * Created by senthil on 26/07/17.
 */
import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {AddNewGalleryComponent} from "../add-new/add-new-gallery.component";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
import {AlbumShareComponent} from "./share/share-album.component";
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
    selector: 'album',
    templateUrl: 'album.html'
})
export class AlbumComponent implements OnInit {

    private albumObjs: any = []
    showWarning: boolean = false

    @Input()
    set albums(albums: any) {
        this.albumObjs = albums;
        this.showWarning = albums !== undefined && albums.length > 0 ? false : true
    }

    deleteObj: any
    baseUrl: any
    featureId: any
    private sub: any;

    @ViewChild(AlbumShareComponent) albumShareComponent: AlbumShareComponent
    @ViewChild(AddNewGalleryComponent) addNewGalleryComponent: AddNewGalleryComponent

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private route: ActivatedRoute,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.sub = this.route.queryParams.subscribe(params => {
            this.featureId = params['fi']
        });
        this.baseUrl = this.baseService.getBaseUrl();
        $('.page-container').addClass('margin-bottom45');
    }

    ngOnDestroy() {
        $('.page-container').removeClass('margin-bottom45');
    }

    shareAlbum(event: any) {
        var id = event.target.nextElementSibling.value
        if (id != 'undefined' && id != null) {
            var obj = this.baseService.getObject(this.albumObjs, {album_id: event.target.nextElementSibling.value});
            this.albumShareComponent.openShareAlbum(event, obj)
        }
    }

    editAlbum(event: any) {
        var id = event.target.nextElementSibling.value
        if (id != 'undefined' && id != null) {
            var obj = this.baseService.getObject(this.albumObjs, {album_id: event.target.nextElementSibling.value});
            this.addNewGalleryComponent.editGallery(event, obj)
        }
    }

    delteRequest(event:  any) {
        var id = event.target.nextElementSibling.value
        if (id != 'undefined' && id != null) {
            this.baseService.showWarning();
            this.deleteObj = this.baseService.getObject(this.albumObjs, {album_id: event.target.nextElementSibling.value});
        }
    }

    deleteAlbum(event:  any) {
        this.commonService.del(this.serviceUrls.galleryAlbum + this.deleteObj.album_id).then(
            result => this.deleteCallBack(result, false),
            error => this.deleteCallBack(<any>error, true))
    }

    deleteCallBack(result: any, err: boolean) {
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
        }
        this.refreshAlbum();
    }

    refreshAlbum() {
        this.baseService.triggerClick('#albumRefresh')
    }

}
