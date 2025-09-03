/**
 * Created by anjan on 8/1/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuggestionsComponent } from './suggestions.component'

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SuggestionsComponent}
        ])
    ],
    exports: [RouterModule],
})

export class SuggestionsRoutingModule { }