/**
 * Created by senthil on 1/23/2017.
 */
import { NgModule } from '@angular/core';
import { FooterComponent } from "./footer.component";
import { FooterRoutingModule } from "./footer.routing.module";

@NgModule({

    imports: [
        FooterRoutingModule
    ],
    exports: [],
    declarations: [FooterComponent],
    providers: [],
})
export class FooterModule { }