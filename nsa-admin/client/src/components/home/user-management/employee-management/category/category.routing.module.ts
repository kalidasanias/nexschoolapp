/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent} from "./category.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CategoryComponent}
        ])
    ],
    exports: [RouterModule],
})
export class CategoryRoutingModule { }