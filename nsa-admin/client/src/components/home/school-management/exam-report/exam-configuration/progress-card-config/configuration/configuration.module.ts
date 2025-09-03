/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../../../../../shared/shared.module"
import {ProgressCardSettingRoutingModule} from "./configuration.routing.module"


@NgModule({

    imports: [
        AppSharedModule,
        ProgressCardSettingRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class ProgressCardSettingModule { }