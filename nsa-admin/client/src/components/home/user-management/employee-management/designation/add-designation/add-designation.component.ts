/**
 * Created by Bharatkumarr  on 27-Mar-17.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {CommonService} from "../../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";


@Component({
    selector: 'add-designation',
    templateUrl: 'add-designation.html'
})


export class AddDesignationComponent implements OnInit {

    designationForm: any;
    designation: any;
    modalId: any;
    buttonVal: string;
    modalTitle: string;
    parent: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonSerive: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
        this.createDesignationForm();
        this.designation= "";
    }

    openModal(event:any, bVal:string, title: string, desg_id: string, parent:any) {
        this.buttonVal = bVal;
        this.modalTitle = title;
        this.parent = parent;
        if (bVal == 'Update') {
            this.commonSerive.get(this.serviceUrls.designation + desg_id)
                .then(designation => this.callBack(designation));
        }
        this.baseService.openOverlay(event);
        if (bVal == 'Save') this.resetForm();
    }

    closeOModal() {
        this.baseService.closeOverlay('#addDesignation');
    }


    createDesignationForm() {
        this.designationForm = this.fb.group({
            "desg_name": ['', Validators.required],
            "desg_alias": '',
            'updated_by': ''
        });

    }

    editForm(form: any) {
        this.designationForm = this.fb.group({
            "desg_name": [form.desg_name,[Validators.required]],
            "desg_alias": form.desg_alias,
            'updated_by': form.updated_by
        });
    }

    saveDesignation(id:any) {
        if (this.designation.desg_id == undefined) {
            this.designationForm._value.updated_by = this.baseService.findUser().name;
            delete this.designationForm.updated_by;
            this.commonSerive.post(this.serviceUrls.designation, this.designationForm._value).then(
                result => this.saveDesignationCallBack(result.message,'bg-success'),
                error => this.saveDesignationCallBack(<any> error,'bg-danger'))

        } else {
            this.designation.desg_name = this.designationForm._value.desg_name;
            this.designation.desg_alias = this.designationForm._value.desg_alias;

            delete this.designation.updated_by;
            this.commonSerive.put(this.serviceUrls.designation + this.designation.desg_id, this.designation).then(
                result => this.saveDesignationCallBack(result.message,'bg-success'),
                error => this.saveDesignationCallBack(<any> error,'bg-danger'))

        }
        this.closeOModal();
    }

    getDesignation(event: any){
        this.modalId = event;
        this.commonSerive.get(this.serviceUrls.designation + event.target.value).then(
            designation => this.callBack(designation)
        );
    }

    callBack(currDesignation: any) {
        this.designation = currDesignation;
        this.editForm(currDesignation);
    }

    saveDesignationCallBack(msg:string, msgIcon:string) {
        this.baseService.showNotification(msg, "", msgIcon);
        this.baseService.closeOverlay('#addDesignation');
        this.resetForm();
        this.baseService.dataTableReload('datatable-designation');
    }

    resetForm(){
        this.createDesignationForm();
        this.designation= "";
    }

}