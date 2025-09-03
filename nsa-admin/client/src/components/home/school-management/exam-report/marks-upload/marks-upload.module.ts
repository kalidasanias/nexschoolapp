/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { MarksUploadRoutingModule } from "./marks-upload.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { MarksUploadComponent } from "./marks-upload.component";

@NgModule({

    imports: [
        AppSharedModule,
        MarksUploadRoutingModule
    ],
    exports: [],
    declarations: [MarksUploadComponent],
    providers: [],
})
export class MarksUploadModule { }