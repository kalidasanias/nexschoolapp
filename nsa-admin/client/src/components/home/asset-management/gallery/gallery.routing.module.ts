/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GalleryComponent} from "./gallery.component";
import * as myGlobals from '../../../../common/constants/global';

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: GalleryComponent},
            { path: 'gallery-view', loadChildren: './view/gallery-view.module#GalleryViewModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Gallery'}},

        ])
    ],
    exports: [RouterModule],
})
export class GalleryRoutingModule { }