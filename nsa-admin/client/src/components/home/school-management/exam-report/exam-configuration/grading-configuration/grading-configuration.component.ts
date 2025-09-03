/**
 * Created by maggi on 19/05/17.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../../../../../../services/index';
import { ServiceUrls, Constants, Messages } from '../../../../../../common/index';
import { Title }     from '@angular/platform-browser';

@Component({
    templateUrl: 'grading-configuration.html'
})

export class GradingConfigurationComponent implements OnInit {
    constructor(private baseService: BaseService) { }
    ngOnInit() {
        this.baseService.setTitle('nsa-grading-aspects');
    }
}
