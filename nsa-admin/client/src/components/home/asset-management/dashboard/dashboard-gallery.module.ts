/**
 * Created by senthil on 28/06/17.
 */
import {NgModule} from "@angular/core";

import {DashboardGalleryRoutingModule} from "./dashboard-gallery.routing.module";
import {AppSharedModule} from "../../../shared/shared.module";
import {SharedModule, TreeModule} from "primeng/primeng";
import {DashboardGalleryComponent} from "./dashboard-gallery.component";
import {AddMediaComponent} from "./add/add-media.component";
import {ImageDetailsComponent} from "./details/image-details.component";

@NgModule({

    imports: [
        AppSharedModule,
        TreeModule,
        SharedModule,
        DashboardGalleryRoutingModule
    ],
    exports: [],
    declarations: [DashboardGalleryComponent, ImageDetailsComponent, AddMediaComponent],
    providers: [],
})
export class DashboardGalleryModule { }