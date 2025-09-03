/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
import {NgModule} from "@angular/core";
import {SecondNavComponent} from "./second-nav.component";
import {SecondNavRoutingModule} from "./second-nav.routing.module";

@NgModule({

    imports: [
        SecondNavRoutingModule
    ],
    exports: [],
    declarations: [SecondNavComponent],
    providers: [],
})
export class SideNavModule { }