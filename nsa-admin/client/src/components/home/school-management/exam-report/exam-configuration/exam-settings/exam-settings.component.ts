/**
 * Created by maggi on 19/05/17.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseService } from '../../../../../../services/index';

@Component({
    templateUrl: 'exam-settings.html'
})

export class ExamSettingsComponent implements OnInit {
    constructor(private baseService: BaseService) { }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.setTitle('nsa-exam-settings');
    }
}
