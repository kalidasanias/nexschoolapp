/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { CategoryRoutingModule } from "./category.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { CategoryComponent } from "../category/category.component";

@NgModule({

    imports: [
        AppSharedModule,
        CategoryRoutingModule
    ],
    exports: [],
    declarations: [CategoryComponent],
    providers: [],
})
export class CategoryModule { }