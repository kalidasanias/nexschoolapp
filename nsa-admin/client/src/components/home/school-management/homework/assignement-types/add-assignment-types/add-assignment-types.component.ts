/**
 * Created by Cyril  on 05-Mar-17.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";


@Component({
    selector: 'add-assignment-types',
    templateUrl: 'add-assignment-types.html'
})

export class AddAssignmentTypesComponent implements OnInit {

    assignmentTypeForm: any;
    assignmentType: any;
    modalId: any;
    btnVal: string


    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit() {
        this.createAssignmentTypeForm();
        this.assignmentType= "";
    }

    openOverlay(event: any) {
        this.btnVal = this.constants.Save;
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#addAssignmentTypes');
    }


    createAssignmentTypeForm() {
        this.assignmentTypeForm = this.fb.group({
            'name': ['', Validators.required],
            'desc': '',
            'updatedUsername': ''
        });
    }

    editForm(form: any) {
        this.assignmentTypeForm = this.fb.group({
            'name': [form.name,[Validators.required]],
            'desc': [form.desc],
            'updatedUsername': form.updatedUsername
        });
    }

    saveAssignmentType(id:any) {
        if (this.assignmentType.id == undefined) {
            this.assignmentTypeForm._value.updatedUsername = this.baseService.findUser().name;

            this.commonService.post(this.serviceUrls.saveAssignmentType, this.assignmentTypeForm._value).then(
                result => this.saveAssignmentTypeCallBack(result, id, false),
                error => this.saveAssignmentTypeCallBack(<any>error, id, true))

        } else {
            this.updateAssignementType(this.assignmentType, this.assignmentTypeForm);

            this.commonService.put(this.serviceUrls.updateAssignementType +this.assignmentType.id, this.assignmentType).then(
                result => this.saveAssignmentTypeCallBack(result, id, false),
                error => this.saveAssignmentTypeCallBack(<any>error, id, true))
        }
    }

    getAssignmentType(event:any){
        this.modalId = event;
        this.commonService.get(this.serviceUrls.getAssignmentType + event.target.value).then(
            assignmentype => this.callBack(assignmentype)
        );
    }

    callBack(value: any) {
        this.btnVal = this.constants.Update;
        this.assignmentType = value;
        this.editForm(value);
        this.baseService.openOverlay(this.modalId);
    }

    saveAssignmentTypeCallBack(result:any, id:any, error:boolean) {
        var successMsg = (id == "Sent" ? "Assignment Type Saved" : "Assignment Type Saved");
        var errorMsg = (id == "Sent" ? "Assignment Type Not Saved" : "Assignment Type Not Saved");
        if (error) {
            this.baseService.showNotification(errorMsg, "", 'bg-danger');
        } else {
            this.baseService.showNotification(successMsg, "", 'bg-success');
            this.baseService.closeOverlay('#addAssignmentTypes');
            this.baseService.dataTableReload('datatable-assignament-types');
            this.resetForm();
        }
    }

    resetForm(){
        this.createAssignmentTypeForm();
        this.assignmentType= "";
    }

    updateAssignementType(form: any, updateAssignementType: any) {
        form.name = updateAssignementType._value.name;
        form.desc = updateAssignementType._value.desc;
        this.assignmentType = form;
    }

}