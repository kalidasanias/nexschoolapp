/**
 * Created by maggi on 19/05/17.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService } from '../../../../../../services/index';

@Component({
    templateUrl: 'progress-card-config.html'
})

export class ProgressCardConfigComponent implements OnInit {
    constructor(private baseService: BaseService) { }
    ngOnInit() {
        this.baseService.setTitle('nsa-progress-card-config');
    }
}
