/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { JournalManagementRoutingModule } from "./journal-management.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { JournalManagementComponent } from "./journal-management.component";

@NgModule({

    imports: [
        AppSharedModule,
        JournalManagementRoutingModule
    ],
    exports: [],
    declarations: [JournalManagementComponent],
    providers: [],
})
export class JournalManagementModule { }