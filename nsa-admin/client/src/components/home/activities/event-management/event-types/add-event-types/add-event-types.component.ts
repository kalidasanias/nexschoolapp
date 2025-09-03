/**
 * Created by Cyril  on 05-Mar-17.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../../services/common/common.service";


@Component({
    selector: 'add-event-types',
    templateUrl: 'add-event-types.html'
})

export class AddEventTypesComponent implements OnInit {

    eventTypeForm: any;
    eventType: any;
    modalId: any;
    btnVal: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit() {
        this.eventType == "";
        this.createEventTypeForm();
    }

    openOverlay(event:any) {
        this.eventType == "";
        this.resetForm();
        this.btnVal = this.constants.Save;
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#addEventTypes');
    }

    createEventTypeForm() {
        this.eventTypeForm = this.fb.group({
            'eventTypeName': ['', Validators.required],
            'desc': '',
        });
    }

    getEventType(id: any, event: any){
        this.modalId = event;
        this.btnVal = this.constants.Update;
        this.commonService.get(this.serviceUrls.eventType + event.target.value).then(
            eventType => this.callBack(eventType)
        );
    }

    callBack(value: any) {
        this.eventType = value;
        this.editForm(value);
    }

    editForm(form: any) {
        this.eventTypeForm = this.fb.group({
            'eventTypeName': [form.event_type_name, [Validators.required]],
            'desc': [form.description],
        });
        this.baseService.openOverlay(this.modalId);
    }

    saveEventType(id:any) {
        if (this.eventType.length < 1) {
            this.commonService.post(this.serviceUrls.eventType, this.eventTypeForm._value).then(
                result => this.saveEventTypeCallBack(result, id, false),
                error => this.saveEventTypeCallBack(<any>error, id, true))

        } else {
            this.commonService.put(this.serviceUrls.eventType + this.eventType.event_type_id, this.eventTypeForm._value).then(
                result => this.saveEventTypeCallBack(result, id, false),
                error => this.saveEventTypeCallBack(<any>error, id, true))
        }
    }

    saveEventTypeCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#addEventTypes');
            this.baseService.dataTableReload('datatable-event-types');
            this.resetForm();
        }
    }

    resetForm(){
        this.createEventTypeForm();
        this.eventType= "";
    }
}