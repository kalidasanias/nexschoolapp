/**
 * Created by senthil-p on 12/05/17.
 */
import {NgModule} from "@angular/core";
import {ForgotPasswordRoutingModule} from "./forgot-pwd.routing.module";
import {AppSharedModule} from "../../shared/shared.module";
import {ForgotPasswordComponent} from "./forgot-pwd.component";

@NgModule({
    imports: [
        AppSharedModule,
        ForgotPasswordRoutingModule
    ],
    exports: [],
    declarations: [ForgotPasswordComponent],
})
export class ForgotPasswordModule { }