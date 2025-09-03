/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { AssignementTypesRoutingModule } from "./assignement-types.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { AssignementTypesComponent } from "../assignement-types/assignement-types.component";
import { AddAssignmentTypesComponent } from "../assignement-types/add-assignment-types/add-assignment-types.component";

@NgModule({

    imports: [
        AppSharedModule,
        AssignementTypesRoutingModule
    ],
    exports: [],
    declarations: [AssignementTypesComponent, AddAssignmentTypesComponent],
    providers: [],
})
export class AssignementTypesModule { }