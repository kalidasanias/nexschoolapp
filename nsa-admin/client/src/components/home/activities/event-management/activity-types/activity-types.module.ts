/**
 * Created by bharatkumarr on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { ActivityTypesRoutingModule } from "./activity-types.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { ActivityTypesComponent } from "./activity-types.component";
import { AddActivityTypeComponent } from "./add-activity-type/add-activity-type.component";

@NgModule({

    imports: [
        AppSharedModule,
        ActivityTypesRoutingModule
    ],
    exports: [],
    declarations: [ActivityTypesComponent, AddActivityTypeComponent],
})
export class ActivityTypesModule { }