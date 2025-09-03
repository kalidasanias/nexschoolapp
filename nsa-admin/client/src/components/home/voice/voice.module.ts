/**
 * Created by bharat on 08/28/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import {NKDatetimeModule} from "ng2-datetime/ng2-datetime";

import { VoiceComponent } from "./voice.component";
import { VoiceRoutingModule } from "./voice.routing.module";
import { TreeModule, SharedModule } from "primeng/primeng";
import { SchedulesComponent } from "./schedules/schedules.component";
import { ScheduleVoiceComponent } from "./schedules/schedule-voice/schedule-voice.component";
import { AudioComponent } from "./audio/audio.component";
import { AddAudioComponent } from "./audio/add-audio/add-audio.component";
import {AppSharedModule} from "../../shared/shared.module";

@NgModule({

    imports: [
       TreeModule, SharedModule,
        NKDatetimeModule,
        ReactiveFormsModule,FormsModule,
        CommonModule,
        AppSharedModule,
        VoiceRoutingModule,

    ],
    exports: [],
    declarations: [VoiceComponent, SchedulesComponent, ScheduleVoiceComponent, AudioComponent, AddAudioComponent],
})
export class VoiceModule { }