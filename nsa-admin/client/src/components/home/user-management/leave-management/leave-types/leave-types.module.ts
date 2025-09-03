/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { LeaveTypesRoutingModule } from "./leave-types.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { LeaveTypesComponent } from "../leave-types/leave-types.component";
import {CreateLeaveTypesComponent} from "./create-leave-type/create-leave-type.component";

@NgModule({

    imports: [
        AppSharedModule,
        LeaveTypesRoutingModule
    ],
    exports: [],
    declarations: [LeaveTypesComponent, CreateLeaveTypesComponent],
    providers: [],
})
export class LeaveTypesModule { }