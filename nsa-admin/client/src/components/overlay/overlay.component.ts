/**
 * Created by senthilPeriyasamy on 1/5/2017.
 */
import {Component, ComponentFactoryResolver, OnInit, ViewContainerRef, ViewEncapsulation} from "@angular/core";
import {BaseService} from "../../services/index";
import {AddGradingSystemComponent} from "../home/school-management/exam-report/exam-configuration/grading-system/add-grading/add-grading.component";
@Component({
    selector: 'overlay',
    templateUrl: 'overlay.html',
})

export class OverlayComponent implements OnInit {

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef,private baseService:BaseService) {

    }

    ngOnInit() {
    }

    openOverlay(event:any) {
        this.baseService.openOverlay(event);
        //this.loadGrading();
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#overlay');
    }

    private loadGrading() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(AddGradingSystemComponent);
        const ref = this.viewContainerRef.createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}

