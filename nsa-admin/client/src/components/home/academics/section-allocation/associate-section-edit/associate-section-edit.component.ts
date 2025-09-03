import {FormBuilder} from "@angular/forms";
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector: 'associate-section-edit',
    templateUrl:'associate-section-edit.html'
})

export class AssociateSectionEditComponent implements OnInit {

    modalId:any
    association: any
    associateSectionEditForm: any

    constructor(private baseService: BaseService,
                private formBuilder: FormBuilder,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.associateSectionEditForm = this.formBuilder.group({
            'className': '',
            'classId': '',
            'sectionName': '',
            'sections': [''],
            'studentIntake': ''
        });
    }

    getEditAssociateSection(event: any) {
        this.modalId = event;
        this.commonService.get(this.serviceUrls.SectionByClass + '/' + event.target.value).then(
            result => this.callback(result)
        );
    }

    callback(value: any){
        this.association = value;
        this.editForm(value);
        this.baseService.openOverlay(this.modalId);
    }

    editForm(form: any){
        this.associateSectionEditForm = this.formBuilder.group({
            'className': form.className,
            'sectionName': form.sectionName,
            'studentIntake':form.studentIntake,
            'sectionId':form.sectionId,
        })
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#associate-edit-section');
    }
    /*update associate section */

    updateSectionAllocation(id: any) {
        if (this.associateSectionEditForm.valid) {
            if (this.associateSectionEditForm != undefined) {
                this.baseService.enableBtnLoading(id);
                this.commonService.put(this.serviceUrls.updateSectionByClass + this.association.classId, this.associateSectionEditForm._value).then(
                    result => this.updateSectionCallBack(result, id, false),
                    error => this.updateSectionCallBack(<any>error, id, true)
                )
            }
        }
    }

    updateSectionCallBack(result: any, id: any, error: boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger')
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#associate-edit-section');
            this.baseService.dataTableReload('datatable-sectionAllocation');
        }
        this.baseService.disableBtnLoading(id);
    }
};
