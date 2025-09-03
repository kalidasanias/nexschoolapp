/**
 * Created by Cyril on 2/22/2017.
 */

import {NgModule} from "@angular/core";
import {SubjectAllocationRoutingModule} from "./subject-allocation.routing.module";
import {AppSharedModule} from "../../../shared/shared.module";
import {SubjectAllocationComponent} from "../subject-allocation/subject-allocation.component";
import {AssociateSubjectsComponent} from "../../../index";
import {SharedModule, TreeModule} from "primeng/primeng";

@NgModule({

    imports: [
        TreeModule, SharedModule, AppSharedModule,
        SubjectAllocationRoutingModule
    ],
    exports: [],
    declarations: [SubjectAllocationComponent, AssociateSubjectsComponent],
})
export class SubjectAllocationModule { }