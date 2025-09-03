/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { LeaveAssignementRoutingModule } from "./leave-assignement.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { LeaveAssignementComponent } from "../leave-assignement/leave-assignement.component";
import { EditLeaveComponent } from "./edit-assign-leave/edit-leave.component";
import {AssignLeaveComponent} from "./assign-leave/assign-leave.component";

@NgModule({

    imports: [
        AppSharedModule,
        LeaveAssignementRoutingModule
    ],
    exports: [],
    declarations: [LeaveAssignementComponent, EditLeaveComponent, AssignLeaveComponent],
    providers: [],
})
export class LeaveAssignementModule { }