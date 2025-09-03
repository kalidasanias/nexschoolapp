/**
 * Created by Cyril on 2/22/2017.
 */


import {NgModule} from "@angular/core";

import {GalleryRoutingModule} from "./gallery.routing.module";
import {AppSharedModule} from "../../../shared/shared.module";
import {GalleryComponent} from "./gallery.component";
import {SharedModule, TreeModule} from "primeng/primeng";
import {AddNewGalleryComponent} from "./add-new/add-new-gallery.component";
import {AlbumComponent} from "./album/album.component";
import {CommonModule} from "@angular/common";
import {AlbumShareComponent} from "./album/share/share-album.component";

@NgModule({

    imports: [
        AppSharedModule,
        TreeModule,
        SharedModule,
        CommonModule,
        GalleryRoutingModule
    ],
    exports: [],
    declarations: [GalleryComponent, AddNewGalleryComponent, AlbumComponent, AlbumShareComponent],
    providers: [],
})
export class GalleryModule { }