import {FormBuilder, Validators} from "@angular/forms";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../src/services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector: 'associate-section',
    templateUrl:'associate-section.html'
})

export class AssociateSection implements OnInit {
    @ViewChild('singleSelectClass') singleSelectClass:ElementRef;
    @ViewChild('multiSelectSection') multiSelectSection: ElementRef;

    associateSection: any;
    associateSectionForm: any;
    class: any[];
    section: any[];
    arr: any[]

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private constants: Constants,
                private serviceUrls: ServiceUrls,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.getClassNames()
        this.getSectionNames()
        this.createForm()
        this.associateSection = ""
    }

    /* show model*/
    openOverlay(event: any){
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#associate-section');
    }

    /* get class names */
    getClassNames(){
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classNames => this.callback(classNames)
        )
    }

    callback(value: any){
        this.class = value;
        this.baseService.enableSelectWithEmpty('#multiselect-class', this.class, this.constants.classObj, null)
    }

    /* get section names*/
    getSectionNames() {
        this.commonService.get(this.serviceUrls.activeSection).then(
            section => this.callbacks(section)
        )
    }

    callbacks(value: any) {
        this.section = value;
        this.baseService.enableMultiSelectAll('.select-section', this.section, this.constants.sectionObj, null)
    }

    /*save method*/
    createForm(){
        this.associateSectionForm = this.formBuilder.group({
            'className': '',
            'classId' : '',
            'sections': [''],
            'studentIntake': ['', Validators.pattern('[0-9]+')]
        });
    }

    saveAssociateSection(id: any){
        this.associateSectionForm._value.className = this.baseService.extractOptions(this.singleSelectClass.nativeElement.selectedOptions)[0].name;
        this.associateSectionForm._value.classId = this.baseService.extractOptions(this.singleSelectClass.nativeElement.selectedOptions)[0].id;
        this.associateSectionForm._value.sections = this.baseService.extractOptions(this.multiSelectSection.nativeElement.selectedOptions);
        var dataFound = this.setValidations();
        if(dataFound === true){
                 if(this.associateSectionForm.valid){
                    this.baseService.enableBtnLoading(id);
                     this.commonService.post(this.serviceUrls.SectionByClass, this.associateSectionForm._value).then(
                         result => this.saveAssociateSectionCallback(result, id, false),
                         error => this.saveAssociateSectionCallback(<any>error, id, true)
                     )
            }
        }

    }

    setValidations():any{
        var dataFound = false;
         if(this.associateSectionForm._value.sections.length < 1){
            this.baseService.showNotification('Please choose section',"", 'bg-danger');
        } else{
            dataFound = true;
        }
        return dataFound;
    }

    saveAssociateSectionCallback(result: any, id: any, error: boolean){
        if(error){
            this.baseService.showNotification(result, "", 'bg-danger')
        }else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#associate-section');
            this.baseService.dataTableReload('datatable-sectionAllocation');
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    resetForm(){
        this.createForm();
        this.associateSection = ""
        this.getClassNames()
        this.getSectionNames()
    }

};