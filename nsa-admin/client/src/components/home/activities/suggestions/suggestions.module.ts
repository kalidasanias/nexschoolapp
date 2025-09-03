/**
 * Created by anjan on 8/1/2017.
 */
import { NgModule } from '@angular/core';
import { SuggestionsComponent } from './suggestions.component';
import { SuggestionsRoutingModule } from './suggestions.routing.module';

@NgModule({
    imports: [
        SuggestionsRoutingModule
    ],
    exports: [],
    declarations: [SuggestionsComponent],
    providers: [],
})

export class SuggestionsModule { }