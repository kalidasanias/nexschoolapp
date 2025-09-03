/**
 * Created by senthil on 1/25/2017.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {CommonService} from "../../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";

@Component({
    selector: 'add-fee',
    templateUrl: 'add-fee.html'
})
export class AddFeeComponent implements OnInit {

    feeTypeForm: any;
    feeType: any;
    modalId: any;
    feeTypeDeposit: any;
    btnVal: string

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {

    }

    createForm() {
        this.feeTypeForm = this.fb.group({
            'feeTypeName': ['', Validators.required],
            'feeTypeDesc': '',
            'feeTypeDeposit': false,
            'updatedBy': '',
            'updatedUsername': ''
        });
    }

    ngOnInit() {
        this.createForm();
        this.feeType= "";
    }

    openOverlay(event: any) {
        this.btnVal = this.constants.Save;
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#addFee');
    }

    getFeeType(event:any){
        this.modalId = event;
        this.commonService.get(this.serviceUrls.getFeeType + '/' + event.target.value).then(
            feeType => this.callBack(feeType)
        );
    }

    callBack(value: any) {
        this.btnVal = this.constants.Update;
        this.feeType = value;
        this.editForm(value);
    }

    editForm(form: any) {
        this.feeTypeDeposit = form.feeDeposit;
        this.feeTypeForm = this.fb.group({
            'feeTypeName': form.name,
            'feeTypeDesc': form.feeTypeDesc,
            'feeTypeDeposit': form.feeDeposit
        });
        if(form.feeDeposit === true) {
            this.baseService.addChecked('#depositTrue');
        } else {
            this.baseService.addChecked('#depositFalse');
        }
        this.baseService.openOverlay(this.modalId);
    }

    saveFeeType(id: any) {
        this.feeTypeForm._value.updatedBy =this.baseService.findUser().id;
        this.feeTypeForm._value.updatedUsername =this.baseService.findUser().name;
        if (this.feeTypeForm.valid) {
            if(this.feeType.id == undefined) {
                this.commonService.post(this.serviceUrls.saveFeeType, this.feeTypeForm._value).then(
                    result => this.saveFeeTypeCallBack(result, id, false),
                    error => this.saveFeeTypeCallBack(<any>error, id, true))

            } else {
                this.updateValue(this.feeType, this.feeTypeForm);
                this.commonService.put(this.serviceUrls.updateFeeType + this.feeType.id, this.feeType).then(
                    result => this.saveFeeTypeCallBack(result, id, false),
                    error => this.saveFeeTypeCallBack(<any>error, id, true))
            }
        }
    }

    saveFeeTypeCallBack(result:any, id:any, error:boolean){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
        this.baseService.showNotification(result.message, "", 'bg-success');
        this.baseService.closeOverlay('#addFee');
        this.baseService.dataTableReload('datatable-fee-type');
        this.resetForm();
    }
}

    resetForm() {
        this.createForm();
        this.feeType = "";
 		this.baseService.addChecked('#depositFalse');
    }

    updateValue(form: any, updateForm: any) {
        form.feeTypeName = updateForm._value.feeTypeName;
        form.feeTypeDesc = updateForm._value.feeTypeDesc;
        form.feeTypeDeposit = updateForm._value.feeTypeDeposit;
        form.updatedBy = updateForm._value.updatedBy;
        form.updatedUsername = updateForm._value.updatedUsername;
        this.feeType = form;
    }
}