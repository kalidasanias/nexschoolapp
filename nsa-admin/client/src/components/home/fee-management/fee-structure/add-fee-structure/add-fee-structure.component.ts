/**
 * Created by senthil on 1/25/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector: 'add-fee-structure',
    templateUrl: 'add-fee-structure.html'
})
export class AddFeeStructureComponent implements OnInit {
    @ViewChild('selectAll') selectAll: ElementRef;
    @ViewChild('selectAll1') selectAll1: ElementRef;
    @ViewChild('single') single: ElementRef;

    private selectedOptions: number[];
    modalId:any;
    terms: any[];
    feeStructureForm:any;
    feeStructure:any;
    feeTypes: any[];
    feeArr: any[];
    feeTerms: any[];
    status = [{value: true, name: 'Active'}, {value: false , name: 'Inactive'}];
    statusValue = ['name', 'value'];
    btnVal: string

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonServiice: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
        this.createForm();
        this.getAllTerms();
        this.getAllFeeTypes();
        this.feeStructure= "";
        this.baseService.enableSelect('#select-status', this.status, this.statusValue, null);
    }

    createForm() {
        this.feeStructureForm = this.fb.group({
            'feeStructureName': ['', Validators.required],
            'feeStructureDesc': '',
            'status':true,
            'feeTypes': [''],
            'terms': [''],
            'updatedUsername':'',
            'updatedBy':''
        });
    }

    openOverlay(event:any) {
        this.btnVal = this.constants.Save;
        this.resetForm();
        if(this.feeTypes.length > 0) {
            this.baseService.openOverlay(event);
        } else {
            this.baseService.showNotification('Assign Fee Type', '', 'bg-danger');
        }
    }

    closeOverlay(event:any) {

        this.baseService.closeOverlay('#feeStructure');
    }

    getFeeStructure(event:any) {
        this.modalId = event;
        this.btnVal = this.constants.Update;
        this.commonServiice.get(this.serviceUrls.getFeeStructure + event.target.value).then(
            feeType => this.callBack(feeType)
        );
    }

    callBack(value:any) {
        this.feeStructure = value;
        this.editForm(value);
    }

    editForm(form:any) {
        this.feeStructureForm = this.fb.group({
            'feeStructureName': form.feeStructureName,
            'feeStructureDesc': form.feeStructureDesc,
        });
        this.feeArr = this.baseService.JsonToArray(form.applicableFeeTypes, this.constants.generalObj);
        /*this.feeTerms = this.baseService.JsonToArray(form.terms, this.constants.generalObj);*/
        this.baseService.enableMultiSelectAll('.multiselect-type',  this.feeTypes, this.constants.feeTypeObj, this.feeArr);
        this.baseService.enableSelectWithEmpty('#multiselect-term', this.terms, this.constants.termObj, form.terms[0].id);
        if(form.status == 'Active') {
            this.baseService.enableSelect('#select-status', this.status, this.statusValue, 'true');
        } else {
            this.baseService.enableSelect('#select-status', this.status, this.statusValue, 'false');
        }

        this.feeStructureForm._value.feeTypes = this.baseService.extractOptions(this.selectAll1.nativeElement.selectedOptions);
        this.feeStructureForm._value.terms = this.baseService.extractOptions(this.selectAll.nativeElement.selectedOptions);
        this.baseService.openOverlay(this.modalId)
    }

    saveFeeStructure(id:any) {
        this.setFormValues(id);
        var dataFound = this.setValidations();
        if(this.feeStructureForm.valid && dataFound){
                if (this.feeStructure.feeStructureId == undefined) {
                    this.commonServiice.post(this.serviceUrls.saveFeeStructure, this.feeStructureForm._value).then(
                        result => this.saveFeeStructureCallBack(result, id, false),
                        error => this.saveFeeStructureCallBack(<any>error, id, true))
                } else {
                    this.updateValue(this.feeStructure, this.feeStructureForm);
                    this.commonServiice.put(this.serviceUrls.updateFeeStructure + this.feeStructure.feeStructureId, this.feeStructure).then(
                        result => this.saveFeeStructureCallBack(result, id, false),
                        error => this.saveFeeStructureCallBack(<any>error, id, true))
                }
            }
    }

    saveFeeStructureCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#feeStructure');
            this.baseService.dataTableReload('datatable-structure-export');
            this.resetForm();
        }
    }

    resetForm() {
        this.createForm();
        this.feeStructure = "";
        this.baseService.enableSelect('#select-status', this.status, this.statusValue, null);
        this.baseService.enableMultiSelectAll('.multiselect-type',  this.feeTypes, this.constants.feeTypeObj, null);
        this.baseService.enableSelectWithEmpty('#multiselect-term', this.terms, this.constants.termObj, null);
    }

    getAllTerms() {
        this.commonServiice.get(this.serviceUrls.getAllTerms).then(
            terms =>  this.callBackTerms(terms)
        )
    }

    getAllFeeTypes() {
        this.commonServiice.get(this.serviceUrls.getFeeTypes).then(
            feeTypes => this.callBackType(feeTypes)
        )
    }

    callBackType(value: any) {
        this.feeTypes = value;
        this.baseService.enableMultiSelectAll('.multiselect-type', value, this.constants.feeTypeObj, null);
    }

    callBackTerms(value: any) {
        this.terms = value;
        this.baseService.enableSelectWithEmpty('#multiselect-term', value, this.constants.termObj, null);
    }

    updateValue(form: any, updateForm: any) {
        form.feeStructureName = updateForm._value.feeStructureName;
        form.feeStructureDesc = updateForm._value.feeStructureDesc;
        form.status = updateForm._value.status
        form.feeTypes = updateForm._value.feeTypes
        form.terms = updateForm._value.terms
        this.feeStructure = form;
        this.feeStructureForm._value.updatedBy = this.baseService.findUser().id;
        this.feeStructureForm._value.updatedUsername =this.baseService.findUser().name;
    }

    setValidations():any{
    var dataFound = false;
        var terms = this.baseService.extractOptions(this.selectAll.nativeElement.selectedOptions)[0];
    if(!terms.id) {
        this.baseService.showNotification('Please select Terms', "", 'bg-danger');
    } else if (!this.feeStructureForm._value.feeTypes.length) {
        this.baseService.showNotification('Please select Fee Types ',"",'bg-danger');
    }else{
        dataFound = true;
    }
    return dataFound;
}

    setFormValues(id: any) {
        this.feeStructureForm._value.status = false;
        this.feeStructureForm._value.status = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].id;
        this.feeStructureForm._value.feeTypes = this.baseService.extractOptions(this.selectAll1.nativeElement.selectedOptions);
        this.feeStructureForm._value.terms = this.baseService.extractOptions(this.selectAll.nativeElement.selectedOptions);
        this.feeStructureForm._value.updatedBy = this.baseService.findUser().id;
        this.feeStructureForm._value.updatedUsername =this.baseService.findUser().name;
    }
}