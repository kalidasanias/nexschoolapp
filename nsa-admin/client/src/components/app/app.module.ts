import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {NKDatetimeModule} from "ng2-datetime/ng2-datetime";

import {AppSharedModule} from "../shared/shared.module";
import {AppRoutingModule} from "./app-routing.module";

import {AppComponent} from "./app.component";
import {JwtHelper} from "angular2-jwt";

import {SessionRoutingModule} from "../session/session-routing.module";
import {LoginRoutingModule} from "../login/login-routing.module";
import {LoginComponent, SessionComponent} from "../index";

import {AuthGuard, BaseService, MainAuthService, ValidationService} from "../../services/index";
import {Constants, Messages, MyRouters, ServiceUrls} from "../../common/index";
import {SuccessComponent} from "../home/confirmation/success/success.component";

@NgModule({
    imports: [
        BrowserModule,
        AppSharedModule,
        HttpModule,
        NKDatetimeModule,
        SessionRoutingModule,
        LoginRoutingModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        SessionComponent,
        SuccessComponent,
        LoginComponent
    ],
    providers: [
        MainAuthService,
        BaseService,
        AuthGuard,
        JwtHelper,
        ValidationService,
        ServiceUrls,
        MyRouters,
        Messages,
        Constants
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
