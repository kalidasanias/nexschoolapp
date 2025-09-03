/**
 * Created by Sai Deepak on 12-Apr-17.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {FormBuilder, Validators} from "@angular/forms";
import {Constants} from "../../../../../../common/constants/constants";
import {ValidationService} from "../../../../../.././services/validation/validation.service";
import {CommonService} from "../../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";

@Component({
    selector: 'create-leave',
    templateUrl: 'create-leave-type.html'
})

export class CreateLeaveTypesComponent implements OnInit {

    leaveTypeForm: any;
    leaveType: any;
    modalId: any;
    buttonVal: string;
    modalTitle: string;
    parent: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) { }

    ngOnInit() {
        this.createLeaveTypeForm();
        this.leaveType= {};
    }

    openModal(event:any, bVal:string, title: string, leave_type_id: string, parent:any) {
        this.buttonVal = bVal;
        this.modalTitle = title;
        this.parent = parent;
        this.leaveType = {leave_type_id: leave_type_id};
        if (bVal == 'Update') {
            this.commonService.get(this.serviceUrls.leaveType + leave_type_id)
                .then(leaveType => this.callBack(leaveType));
        }
        this.baseService.openOverlay(event);
        if (bVal == 'Save') this.resetForm();
    }

    closeOModal() {
        this.baseService.closeOverlay('#addLeaveType');
    }


    createLeaveTypeForm() {
        this.leaveTypeForm = this.fb.group({
            'leave_type_name': ['', Validators.required],
            'description': '',
            'updated_by': '',
            'days': ['', [ValidationService.numberValidator]]
        });
    }

    editForm(form: any) {
        this.leaveTypeForm = this.fb.group({
            'leave_type_name': [form.leave_type_name,[Validators.required]],
            'description': form.description,
            'days': [form.days.toString(),ValidationService.numberValidator]
        });
    }

    saveLeaveType(leave_type_id:any, id:any) {
        this.baseService.enableBtnLoading(id);
        if (this.leaveType.leave_type_id == undefined) {
            this.leaveTypeForm._value.updated_by = this.baseService.findUser().name;
            this.leaveTypeForm._value.days = Number(this.leaveTypeForm._value.days);

            delete this.leaveTypeForm.updated_by;
            this.commonService.post(this.serviceUrls.leaveType, this.leaveTypeForm._value).then(
                result => this.saveLeaveTypeCallBack(result.message,'bg-success', id),
                error => this.saveLeaveTypeCallBack(<any> error,'bg-danger', id))

        } else {
            this.leaveType.leave_type_name = this.leaveTypeForm._value.leave_type_name;
            this.leaveType.description = this.leaveTypeForm._value.description;
            this.leaveType.days = Number(this.leaveTypeForm._value.days);

            this.commonService.put(this.serviceUrls.leaveType + this.leaveType.leave_type_id, this.leaveType).then(
                result => this.saveLeaveTypeCallBack(result.message,'bg-success', id),
                error => this.saveLeaveTypeCallBack(<any> error,'bg-danger', id))

        }
        this.closeOModal();
    }

    getLeaveType(event: any){
        this.modalId = event;
        this.commonService.get(this.serviceUrls.leaveType + event.target.value).then(
            leaveType => this.callBack(leaveType)
        );
    }

    callBack(currLeaveType: any) {
        this.leaveType = currLeaveType;
        this.editForm(currLeaveType);
    }

    saveLeaveTypeCallBack(msg:string, msgIcon:string, btnId: any) {
        this.baseService.showNotification(msg, "", msgIcon);
        this.baseService.disableBtnLoading(btnId);
        this.baseService.closeOverlay('#addLeaveType');
        this.resetForm();
        this.baseService.dataTableReload('datatable-leave-type');

    }

    resetForm(){
        this.createLeaveTypeForm();
        this.leaveType= "";
    }
}