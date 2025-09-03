/**
 * Created by senthil on 1/25/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ValidationService} from "../../../../../../services/validation/validation.service";
import {BaseService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";

@Component({
    selector: 'add-scholarship',
    templateUrl: 'add-scholarship.html'
})

export class AddScholarshipComponent implements OnInit {
    scholarshipForm: any;
    feeType: any;
    modalId: any;
    btnVal: string;
    @ViewChild('dueDate') dueDate: ElementRef

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private formBuilder:FormBuilder,
                private constants: Constants) {

    }

    ngOnInit() {
        this.createForm();
        this.feeType= "";
    }

    validateAmount(event: any, boolVal:any) {
        this.baseService.numberOnly(event, boolVal);
    }

    openOverlay(event: any) {
        this.btnVal = this.constants.Save;
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#addScholarship');
    }

    createForm() {
        this.scholarshipForm = this.formBuilder.group({
            'name': ['', Validators.required],
            'validUpto': '',
            'amount': ['', ValidationService.negitiveNumberValidator],
            'scholarshipDesc': '',
            'updatedUsername': '',
            'updatedBy': '',
        });
    }

    editForm(form: any) {
        this.scholarshipForm = this.formBuilder.group({
            'name': [form.name,Validators.required],
            'validUpto': [form.validUpto],
            'amount': [form.amount.toString(), ValidationService.negitiveNumberValidator],
            'scholarshipDesc': form.scholarshipDesc,
        });
    }

    saveScholarship(id:any) {
        this.scholarshipForm._value.validUpto = this.dueDate.nativeElement.value + " 23:59:00";
        this.scholarshipForm._value.updatedUsername =this.baseService.findUser().name;
        this.scholarshipForm._value.updatedBy =this.baseService.findUser().id;
        var dataFound = this.setValidation();
        if (this.scholarshipForm.valid && dataFound) {
            this.baseService.enableBtnLoading(id);
            if (this.feeType.id == undefined) {
                this.commonService.post(this.serviceUrls.saveFeeScholarship, this.scholarshipForm._value).then(
                    result => this.saveScholarshipCallBack(result, id, false),
                    error => this.saveScholarshipCallBack(<any>error, id, true))

            } else {
                this.updateScholarship(this.feeType, this.scholarshipForm);
                this.commonService.put(this.serviceUrls.updateFeeScholarship + this.feeType.id, this.feeType).then(
                    result => this.saveScholarshipCallBack(result, id, false),
                    error => this.saveScholarshipCallBack(<any>error, id, true))
            }
        }
    }

    setValidation(){
        var dataFound = false;
        if(this.scholarshipForm._value.validUpto.length < 1){
            this.baseService.showNotification('Please Select Date',"", 'bg-danger')
        }else {
            dataFound = true;
        }
        return dataFound;
    }

    getFeeScholarships(event: any){
        this.modalId = event;
        this.commonService.get(this.serviceUrls.getFeeScholarship +  event.target.value).then(
            scholarship => this.callBack(scholarship)
        );
    }

    callBack(value: any) {
        this.feeType = value;
        this.editForm(value);
        this.btnVal = this.constants.Update;
        this.baseService.openOverlay(this.modalId);
    }

    saveScholarshipCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#addScholarship');
            this.baseService.dataTableReload('datatable-scholarship');
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }


    callBackScholarship(res:any, value:any, error:boolean) {
       var successMsg = "Scholarship Details Saved";
        if (error) {
            this.baseService.showNotification(res, "", 'bg-danger');
        } else {
            this.baseService.showNotification(successMsg, "", 'bg-success');
            this.baseService.closeModal('modal_theme_primary');
            this.baseService.dataTableReload('datatable-scholarship');
            this.resetForm();
        }
        this.baseService.disableBtnLoading(value);
    }

    resetForm(){
        this.createForm();
        this.feeType= "";
    }

    updateScholarship(form: any, updateScholarship: any) {
        form.name = updateScholarship._value.name;
        form.validUpto = updateScholarship._value.validUpto;
        form.amount= updateScholarship._value.amount;
        form.scholarshipDesc = updateScholarship._value.scholarshipDesc;
        form.updatedBy = updateScholarship._value.updatedBy;
        form.updatedUsername = updateScholarship._value.updatedUsername;
        this.feeType = form;
    }

}