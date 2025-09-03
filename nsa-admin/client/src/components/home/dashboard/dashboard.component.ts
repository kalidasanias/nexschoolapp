/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import { Component, OnInit, ViewChild }    from '@angular/core';
import { BaseService } from "../../../services/index";
import {OverlayComponent} from "../../overlay/overlay.component";
@Component({
    templateUrl: 'dashboard.html'
})
export class DashboardComponent {

    @ViewChild(OverlayComponent) overlayComponent: OverlayComponent
    constructor(private baseService: BaseService) {}

    openOverlay(event: any) {
        this.overlayComponent.openOverlay(event)
    }

}

