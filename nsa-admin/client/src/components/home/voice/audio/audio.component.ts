/**
 * Created by bharat on 08/28/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {BaseService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {AddAudioComponent} from "./add-audio/add-audio.component";
import {OnDestroy} from "../../../../../node_modules/@angular/core/src/metadata/lifecycle_hooks";
@Component({
    selector: 'audio-gallery',
    templateUrl: 'audio.html'
})

export class AudioComponent implements OnInit {
    @ViewChild(AddAudioComponent) addAudioComponent:AddAudioComponent;

    enable:boolean = false;

    constructor(private constants:Constants,
                private baseService:BaseService,
                private serviceUrls: ServiceUrls,
                private commonService:CommonService) {
    }
    ngOnInit() {
        this.enable = this.baseService.havePermissionsToEdit(this.constants.VOICE_PERMISSIONS);
        this.baseService.enableDataTableAjax(this.serviceUrls.getAllAudios, this.baseService.getBaseUrl());
        this.baseService.initializeAudioControls();
    }
    addAudio(event:any) {
        this.addAudioComponent.openOverlay(event);
    }

}

