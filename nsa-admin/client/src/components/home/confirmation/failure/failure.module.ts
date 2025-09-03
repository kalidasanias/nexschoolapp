/**
 * Created by senthil on 3/25/2017.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../../shared/shared.module";
import {FailureRoutingModule} from "./failure.routing.module";
import {FailureComponent} from "./failure.component";

@NgModule({
    imports: [
        FailureRoutingModule,
        AppSharedModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class FailureModule { }