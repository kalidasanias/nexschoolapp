/**
 * Created by Sai Deepak on 2/22/2017.
 */


import { NgModule } from '@angular/core';
import { AppSharedModule } from "../../../../shared/shared.module";
import { MyLeavesComponent } from "./my-leaves.component";
import { MyLeavesRoutingModule } from "./my-leaves.routing.module";
import {ApplyLeavesComponent} from "./apply-leave/apply-leave.component";

@NgModule({

    imports: [
        AppSharedModule,
        MyLeavesRoutingModule
    ],
    exports: [],
    declarations: [MyLeavesComponent, ApplyLeavesComponent],
    providers: [],
})
export class MyLeavesModule { }