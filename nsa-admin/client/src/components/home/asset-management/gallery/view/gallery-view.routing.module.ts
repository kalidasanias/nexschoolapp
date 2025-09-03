/**
 * Created by senthil on 28/06/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GalleryViewComponent} from "./gallery-view.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: GalleryViewComponent}
        ])
    ],
    exports: [RouterModule],
})
export class GalleryViewRoutingModule { }