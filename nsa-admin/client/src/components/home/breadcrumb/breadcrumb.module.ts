/**
 * Created by senthil on 1/23/2017.
 */
import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from "./breadcrumb.component";
import { BreadcrumbRoutingModule } from "./breadcrumb.routing.module";

@NgModule({

    imports: [
        BreadcrumbRoutingModule
    ],
    exports: [],
    declarations: [BreadcrumbComponent],
    providers: [],
})
export class BreadcrumbModule { }