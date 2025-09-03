/**
 * Created by senthil-p on 11/05/17.
 */
import { NgModule } from '@angular/core';
import { ChangePasswordRoutingModule } from "./change-pwd.routing.module";
import {AppSharedModule} from "../../../shared/shared.module";
import {ChangePasswordComponent} from "./change-pwd.component";

@NgModule({
    imports: [
        AppSharedModule,
        ChangePasswordRoutingModule
    ],
    exports: [],
    declarations: [ChangePasswordComponent],
    providers: [],
})
export class ChangePasswordModule { }