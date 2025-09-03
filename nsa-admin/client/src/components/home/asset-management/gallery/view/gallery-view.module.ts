/**
 * Created by senthil on 28/06/17.
 */
import {NgModule} from "@angular/core";

import {GalleryViewRoutingModule} from "./gallery-view.routing.module";
import {AppSharedModule} from "../../../../shared/shared.module";
import {SharedModule, TreeModule} from "primeng/primeng";
import {GalleryViewComponent} from "./gallery-view.component";
import {AlbumDetailsComponent} from "./details/album-details.component";
import {AddMediaComponent} from "./add/add-media.component";

@NgModule({

    imports: [
        AppSharedModule,
        TreeModule,
        SharedModule,
        GalleryViewRoutingModule
    ],
    exports: [],
    declarations: [GalleryViewComponent, AlbumDetailsComponent, AddMediaComponent],
    providers: [],
})
export class GalleryViewModule { }