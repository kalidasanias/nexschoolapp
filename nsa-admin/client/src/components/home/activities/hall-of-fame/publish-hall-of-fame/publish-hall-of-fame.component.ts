/**
 * Created by intellishine on 9/11/2017.
 */
import {Component, OnInit, Input, ViewChild,ElementRef} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
    selector: 'publish-hall-of-fame',
    templateUrl: 'publish-hall-of-fame.html'
})

export class PublishHallOfFameComponent implements OnInit {

    edithallOfFameForm: any;
    modalId: any;
    data: any;

    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private constants: Constants,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.enablePickerDate();
        this.createEventForm();
    }
    createEventForm() {
        this.edithallOfFameForm = this.fb.group({
            'awardName': '',
            'awardId': '',
            'dateOfIssue': '',
            'students': [],
            'desc': '',
            'status': '',
            "notify":  this.fb.group({
                "sms": '',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': 'Sent',
            })
        });
    }

    getHallOfFame(event: any){
        this.modalId = event;
        this.data = JSON.parse(event.target.value);
        this.editForm(this.data);
    }

    editForm(value: any) {
        this.edithallOfFameForm = this.fb.group({
            'awardName': value.award_name,
            'awardId': value.award_id,
            'dateOfIssue': value.date_of_issue,
            'students': [JSON.parse(value.notified_students)],
            'desc': value.description,
            'status': true,
            "notify":  this.fb.group({
                "sms": '',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': 'Sent',
            })
        });
        this.openOverlay(this.modalId);
    }

    publishHallOfFame(id: any) {
                this.baseService.enableBtnLoading(id);
                this.edithallOfFameForm._value.notify.sms = this.sms.nativeElement.checked;
                this.edithallOfFameForm._value.notify.email = this.email.nativeElement.checked;
                this.edithallOfFameForm._value.notify.push = this.push.nativeElement.checked;
                this.commonService.put(this.serviceUrls.hallOfFame + this.data.id, this.edithallOfFameForm._value).then(
                    result => this.saveHallOfFameCallBack(result, id, false),
                    error => this.saveHallOfFameCallBack(<any>error, id, true))


      }

    saveHallOfFameCallBack(result: any, id:any , err: any) {
        var successMsg = this.constants.publishHallOfFame;
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(successMsg , "", 'bg-success');
            this.baseService.dataTableReload('datatable-hall-of-fame');
            this.baseService.closeOverlay('#hallOfFamePublish');
            this.createEventForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    openOverlay(event:any) {
        this.getFeatureChannelConfiguration();
        this.baseService.dataTableDestroy('datatable-publish-hall-of-fame');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.hallOfFameDetails + this.data.id);
        this.baseService.openOverlay(event);
    }
    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#hallOfFamePublish');
    }
}