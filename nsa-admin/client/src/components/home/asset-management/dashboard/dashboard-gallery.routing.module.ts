/**
 * Created by senthil on 28/06/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardGalleryComponent} from "./dashboard-gallery.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: DashboardGalleryComponent}
        ])
    ],
    exports: [RouterModule],
})
export class DashboardGalleryRoutingModule { }