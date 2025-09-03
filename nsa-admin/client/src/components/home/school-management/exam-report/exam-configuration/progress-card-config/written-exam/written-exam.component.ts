/**
 * Created by maggi on 07/05/17.
 */
import {Component, OnInit, forwardRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ServiceUrls, Constants, Messages } from '../../../../../../../common/index';
import { BaseService } from '../../../../../../../services/index';
import { AddExamComponent } from '../../../../../../index'

@Component({
    selector : 'written_examination',
    templateUrl: 'written-exam.html'
})
export class WrittenExamComponent implements OnInit {

    @ViewChild(AddExamComponent) addExamComponent: AddExamComponent

    constructor(private baseService: BaseService, private serviceUrls: ServiceUrls) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Written Exams');
    }

    addWrittenExam(event: any) {
        this.addExamComponent.show(event)
    }


}