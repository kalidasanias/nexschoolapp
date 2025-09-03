/**
 * Created by bharat on 08/28/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoiceComponent } from "./voice.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild(<Routes>[
            {path: '', component: VoiceComponent}
        ])
    ],
    exports: [RouterModule],
})
export class VoiceRoutingModule { }