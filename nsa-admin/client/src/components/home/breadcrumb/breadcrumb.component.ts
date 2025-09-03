import { Component, ViewChild } from "@angular/core";
import { Breadcrumb, BreadcrumbService } from "./breadcrumb.service"
import {HelpTextComponent} from "../common/helptext/helptext.component";

@Component({
    selector: "breadcrumb",
    templateUrl: 'breadcrumb.html'
})
export class BreadcrumbComponent {
    breadcrumbs: Breadcrumb[];
    @ViewChild(HelpTextComponent) helpTextComponent: HelpTextComponent

    constructor(private breadcrumbService: BreadcrumbService) {
        breadcrumbService.onBreadcrumbChange.subscribe((crumbs: Breadcrumb[]) => {
            this.breadcrumbs = crumbs;
        });
    }

    showHelpText() {
        this.helpTextComponent.showPopup();
    }
}