/**
 * Created by senthil on 3/24/2017.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../shared/shared.module";
import {CcavenueComponent} from "./ccavenue.component";
import {CcavenueRoutingModule} from "./ccavenue.routing.module";

@NgModule({
    imports: [
        CcavenueRoutingModule,
        AppSharedModule
    ],
    exports: [],
    declarations: [CcavenueComponent],
})
export class CcavenueModule { }