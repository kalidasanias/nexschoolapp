/**
 * Created by senthilPeriyasamy on 12/28/2016.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Constants, Messages, ServiceUrls} from "../../../common/index";
import {BaseService} from "../../../services/index";
import {CommonService} from "../../../services/common/common.service";
@Component({
    templateUrl: 'notification.html'
})
export class NotificationComponent implements OnInit {


    constructor(private constants:Constants,
                private baseService:BaseService,
                private commonService:CommonService) {
    }


    ngOnInit() {
        this.baseService.setTitle('NSA - Voice Messages');
        this.baseService.enableAppJs();
    }

}