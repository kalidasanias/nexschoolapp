/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { AssignLeaveRoutingModule } from "./assign-leave.routing.module";
import { AppSharedModule } from "../../../../../shared/shared.module";
import { AssignLeaveComponent } from "./assign-leave.component";

@NgModule({

    imports: [
        AppSharedModule,
        AssignLeaveRoutingModule
    ],
    exports: [],
    declarations: [AssignLeaveComponent],
    providers: [],
})
export class AssignLeaveModule { }