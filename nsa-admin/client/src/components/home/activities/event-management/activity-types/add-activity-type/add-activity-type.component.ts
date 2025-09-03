/**
 * Created by bharatkumarr  on 05-Mar-17.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../../services/common/common.service";


@Component({
    selector: 'add-activity-type',
    templateUrl: 'add-activity-type.html'
})

export class AddActivityTypeComponent implements OnInit {

    activityTypeForm: any;
    activityType: any;
    modalId: any;
    btnVal: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit() {
        this.activityType == "";
        this.createActivityTypeForm();
    }

    openOverlay(event:any) {
        this.activityType == "";
        this.resetForm();
        this.btnVal = this.constants.Save;
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#addActivityType');
    }

    createActivityTypeForm() {
        this.activityTypeForm = this.fb.group({
            'activity_type_name': ['', Validators.required],
            'description': '',
        });
    }

    getActivityType(id: any, event: any){
        this.modalId = event;
        this.btnVal = this.constants.Update;
        this.commonService.get(this.serviceUrls.activityType + event.target.value).then(
            eventType => this.callBack(eventType)
        );
    }

    callBack(value: any) {
        this.activityType = value;
        this.editForm(value);
    }

    editForm(form: any) {
        this.activityTypeForm = this.fb.group({
            'activity_type_name': [form.activity_type_name, [Validators.required]],
            'description': [form.description],
        });
        this.baseService.openOverlay(this.modalId);
    }

    saveActivityType(id:any) {
        if (this.activityType.length < 1) {
            this.commonService.post(this.serviceUrls.activityType, this.activityTypeForm._value).then(
                result => this.saveActivityTypeCallBack(result, id, false),
                error => this.saveActivityTypeCallBack(<any>error, id, true))

        } else {
            this.commonService.put(this.serviceUrls.activityType + this.activityType.activity_type_id, this.activityTypeForm._value).then(
                result => this.saveActivityTypeCallBack(result, id, false),
                error => this.saveActivityTypeCallBack(<any>error, id, true))
        }
    }

    saveActivityTypeCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#addActivityType');
            this.baseService.dataTableReload('datatable-activity-types');
            this.resetForm();
        }
    }

    resetForm(){
        this.createActivityTypeForm();
        this.activityType= "";
    }
}