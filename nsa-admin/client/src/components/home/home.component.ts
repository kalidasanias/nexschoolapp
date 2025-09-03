/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import {Component, OnInit} from "@angular/core";

import {BaseService} from "../../services/index";


@Component({
    templateUrl: 'home.html'
})
export class HomeComponent implements OnInit {

    user: any;
    constructor(private baseService: BaseService) {
    }
    ngOnInit() {
        this.baseService.setTitle('NSA - Home');
        this.baseService.removeBackgroundImage();
        this.user = this.baseService.findUser();
    }
}