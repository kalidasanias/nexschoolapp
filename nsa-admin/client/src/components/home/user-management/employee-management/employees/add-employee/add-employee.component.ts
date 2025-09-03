/**
 * Created by Cyril  on 05-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ValidationService} from "../../../../../../services/validation/validation.service";
import {BaseService, TreeService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {FileUploader} from "ng2-file-upload";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
import {AttachmentComponent} from "../../../../common/attachment/attachment.component";
import {CommonService} from "../../../../../../services/common/common.service";
declare var moment: any;


@Component({
    selector: 'add-employee',
    templateUrl: 'add-employee.html'
})

export class AddEmployeeComponent implements OnInit {
    @ViewChild('dept') dept: ElementRef;
    @ViewChild('desg') desg: ElementRef;
    @ViewChild('gender') gender1: ElementRef;
    @ViewChild('date_of_birth') date_of_birth: ElementRef;
    @ViewChild('date_of_joining') date_of_joining: ElementRef;
    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;

    data:any[] = [];
    hash : any [] = [];
    password: boolean = false;
    selectedNodes:any[] = [];
    classes: any[] = [];
    userType: any[] = [];
    employeeForm: any;
    employee: any;
    modalId: any;
    parent: any;
    buttonVal: string;
    departments: any[];
    designations: any[];
    gender = [{value: 'male', name: 'Male'}, {value: 'female' , name: 'Female'}];
    attachments: any[] = [];
    attachmentsForm: any = {};
    employeeData: any = {};
    taxanomy: any[]= [];
    uploadId: any;
    event: any;

    //public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload'});
    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', allowedMimeType: this.constants.allowFileTypes});

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private treeService: TreeService,
                private commonService: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
        this.uploader.options.headers = this.baseService.getHeaderContentForUploader();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        }

        this.uploader.onWhenAddingFileFailed = (item:any, filter:any, options:any) => {
            this.baseService.showUploadFileNotification(item, filter, options)
            return {item, filter, options};
        }

        this.uploader.onBuildItemForm = (item, form) => {
            form.append('uploadId', this.uploadId);
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.attachments.push(this.baseService.extractAttachment(response))
        }
        this.createEmployeeForm();
        this.employee= "";
        this.getDependantData();
        this.getAllDeptCategories();
    }


    openOverlay(event:any, bVal:string, emp_id: string, parent:any) {
        this.buttonVal = bVal;
        this.event = event;
        this.baseService.removeHideClass('#viewAttachment');
        this.parent = parent;
        if (bVal == 'Update') {
            this.password = true;
            this.commonService.get(this.serviceUrls.employee + event.target.value).then(data => this.callBackSuccessGet(data));
        } else {
            this.employeeData['attachments'] = null;
            this.password = false;
            this.baseService.enableSelect('#select-gender', this.gender, [ 'name', 'value' ], null);
            this.baseService.enableMultiSelectFilteringAll('#select-dept', this.departments,[ 'dept_name', 'dept_id' ], null);
            this.baseService.enableSelectWithEmpty('#select-desg', this.designations,[ 'desg_name', 'desg_id' ], null);
            this.baseService.openOverlay(event);
        }
    }

    callBackSuccessGet(formData: any) {
        if(formData.active){
            this.employeeData = formData;
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            this.editForm(formData);
            this.updateTree(formData);

            var dob = new Date(formData.date_of_birth);
            this.date_of_birth.nativeElement.value = dob.getDate() + ' ' + monthNames[dob.getMonth()] + ', ' + dob.getFullYear();

            var doj = new Date(formData.date_of_joining);
            this.date_of_joining.nativeElement.value = doj.getDate() + ' ' + monthNames[doj.getMonth()] + ', ' + doj.getFullYear();
            this.baseService.enableSelect('#select-gender', this.gender, [ 'name', 'value' ], formData.gender);
            this.baseService.enableMultiSelectFilteringAll('#select-dept', this.departments,[ 'dept_name', 'dept_id' ], formData.dept_id);
            this.baseService.enableSelect('#select-desg', this.designations,[ 'desg_name', 'desg_id' ], formData.desg_id);
            this.baseService.openOverlay(this.event);
        }else {
           this.baseService.showNotification(this.constants.deActiveEmployeeErr ,"", "bg-danger")
        }
    }

    getDependantData() {
        this.commonService.get(this.serviceUrls.department)
            .then(departments => this.callbackDepartments(departments));

        this.commonService.get(this.serviceUrls.designation)
            .then(designations => this.callbackDesignations(designations));
    }

    callbackDepartments(departments: any[]) {
        this.departments = departments;
    }

    callbackDesignations(designations: any[]) {
        this.designations = designations;
    }

    getAllDeptCategories() {
        this.commonService.get(this.serviceUrls.getAllDeptCategories).then(
            data => this.callBackData(data)
        )
    }

    callBackData(data:any) {
        this.data = data;
        this.taxanomy = data;
        this.hash = this.treeService.buildDataHierarchy(data);
    }

    editEmployee(event: any) {
        this.openOverlay(event, 'Update', null, this.parent);
    }

    closeOverlay() {
        this.baseService.closeOverlay('#addEmployee');
        this.uploader.clearQueue();
        this.resetForm();
    }

    createEmployeeForm() {
        this.date_of_joining.nativeElement.value = '';
        this.date_of_birth.nativeElement.value = '';

        this.employeeForm = this.fb.group({
            'first_name': ['', [Validators.required, ValidationService.alphabetValidator]],
            'middle_name': '',
            'last_name': '',
            'short_name': ['',Validators.required],
            'primary_phone': ['',[Validators.required, ValidationService.phoneValidator, Validators.minLength(10), Validators.maxLength(10)]],
            'nationality': '',
            'email': '',
            'password': [''],
            'gender': 'male',
            'dept_id': '',
            'desg_id': '',
            'date_of_birth': '',
            'date_of_joining': '',
            'user_code': ['', Validators.required]
        });
    }


    editForm(form: any) {
        var dateOfBirth = form.date_of_birth != null ? moment(form.date_of_birth).format('ll') :'';
        var dataOfJoinning = form.date_of_joining != null ? moment(form.date_of_joining).format('ll') : '';
        this.employeeForm = this.fb.group({
            'id' : form.id,
            'first_name': [form.first_name, [Validators.required, ValidationService.alphabetValidator]],
            'middle_name': form.middle_name,
            'last_name': form.last_name,
            'primary_phone': [form.primary_phone,[Validators.required, ValidationService.phoneValidator, Validators.minLength(10), Validators.maxLength(10)]],
            'short_name': [form.short_name,Validators.required],
            'email': [form.email == null ? '' : form.email],
            'gender': form.gender,
            'nationality': form.nationality,
            'dept_id': [form.dept_id],
            'date_of_birth': dateOfBirth,
            'date_of_joining': dataOfJoinning,
            'user_code': [form.user_code],
            'user_name': [form.user_name]
        });
        this.baseService.enableSelect('#select-desg',  this.designations, this.constants.designationObj, form.desg_id);


    }

    saveEmployee(id:any) {
        this.setFormInfo();
        var dataFound = this.setValidations();
        if(dataFound) {
            if (this.employeeForm._value.id == undefined) {
                delete this.employeeForm.updated_by;
                this.commonService.post(this.serviceUrls.employee, this.employeeForm._value).then(
                    result => this.saveEmployeeCallBack(result, id, 'Saved', false),
                    error => this.saveEmployeeCallBack(<any>error, id, 'Saved', true))

            } else {
                delete this.employeeForm.updated_by;
                this.commonService.put(this.serviceUrls.employee + this.employeeForm._value.user_name, this.employeeForm._value).then(
                    result => this.saveEmployeeCallBack(result, id, 'Updated', false),
                    error => this.saveEmployeeCallBack(<any>error, id, 'Updated', true))
            }
        }
    }

    private setFormInfo() {
        this.employeeForm._value.date_of_birth = this.date_of_birth.nativeElement.value;
        this.employeeForm._value.date_of_joining = this.date_of_joining.nativeElement.value;
        var selectedDept = this.getDepartments(this.classes);
        this.employeeForm._value.dept_id = selectedDept.dept;
        this.employeeForm._value.subjects = selectedDept.subj;
        this.employeeForm._value.selectedNodes = this.selectedNodes;
        this.employeeForm._value.taxanomy = this.baseService.removeCylicObj(this.taxanomy);
        this.employeeForm._value.desg_id = this.baseService.extractOptionValue(this.desg.nativeElement.selectedOptions)[0];
        if(this.gender1.nativeElement.selectedOptions.length < 1) {
            this.employeeForm._value.gender = this.gender[0].value;
        } else {
            this.employeeForm._value.gender = this.baseService.extractOptionValue(this.gender1.nativeElement.selectedOptions)[0];
        }

    }

    setValidations():any{
        var dataFound =false;
        if(this.classes == undefined ||  this.classes.length < 1) {
            this.baseService.showNotification('Select Department Details', "", 'bg-danger');
        } else if(this.employeeForm._value.desg_id.length < 1){
            this.baseService.showNotification("Enter Designation","",'bg-danger');
        } else {
            dataFound = true;
        }
        return dataFound;
    }

    saveEmployeeCallBack(result:any, id:any, method: string, error:boolean) {
        this.uploadId = result.id;
        this.uploader.onCompleteAll = () => {
            this.attachmentsForm['id'] = result.id;
            this.attachmentsForm['attachments'] = this.attachments;
            this.addAttachements(this.attachmentsForm, id)
        }
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            if(this.uploader.getNotUploadedItems().length) {
                this.uploader.uploadAll();
            } else {
                this.addAttachementsCallback(result, id, error)
            }
        }
    }

    addAttachements(data: any, id: any) {
        this.commonService.put(this.serviceUrls.userAttachments + data.id, data).then(
            result => this.addAttachementsCallback(result, id, false),
            error => this.addAttachementsCallback(<any>error, id, true))
    }

    addAttachementsCallback(result: any, id:any , err: any) {
        this.attachments.pop();
        this.baseService.showNotification(result.message, "", 'bg-success');
        this.baseService.enableDivLoading('.datatable-employee', this.constants.updating);
        var thisObj = this;
        setTimeout(function () {
            thisObj.baseService.dataTableReload('datatable-employee');
            thisObj.baseService.disableDivLoading('.datatable-employee');
        }, 1000)

        this.baseService.closeOverlay('#addEmployee');
        this.attachments = [];
        this.resetForm();
        this.uploader.clearQueue();
        this.getDependantData();
    }

    nodeSelected(toggleNode:any) {
        // select / unselect addCheckedall children (recursive)
        let toggleChildren = (node:any) => {
            node.children.forEach(function (child:any) {
                node['expanded'] = true;
                child.selected = node.selected;
                if (child.children.length) {
                    toggleChildren(child);
                }
            });
        }

        toggleChildren(toggleNode);
        //update parent if needed (recursive)
        let updateParent = (node:any) => {
            if (node.parentNodeId != 0) {
                const parentNode = this.hash[node.parentNodeId];
                const siblings = parentNode.children;
                parentNode.partialSelection = false;
                let equalSiblings = true;
                siblings.forEach(function (sibling:any) {
                    if (sibling.selected !== node.selected) {
                        equalSiblings = false;
                    }
                });
                if (equalSiblings) {
                    parentNode.selected = node.selected;
                    if (parentNode.parentNodeId != 0) {
                        updateParent(parentNode);
                    }
                } else {
                    parentNode.partialSelection = true;
                }
            }
        }

        this.baseService.addChecked('.radio1');
        updateParent(toggleNode);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
    }

    resetForm(){
        this.classes = [];
        this.selectedNodes = [];
        this.createEmployeeForm();
        this.classes = [];
        this.employee= "";
        this.getAllDeptCategories();
    }

    viewAttachment() {
        delete this.employeeData.id;
        this.employeeData['url'] = this.serviceUrls.userAttachments;
        this.employeeData['id'] = this.employeeData.user_name;
        this.attachmentComponent.openModal(this.baseService.removeCylicObj(this.employeeData), true);
    }

    updateTree(form: any) {
        if(form.selected_categories != null) {
            this.myUpdate(typeof form.selected_categories === 'string' ? JSON.parse(form.selected_categories): form.selected_categories);
        }

    }

    myUpdate(data: any[]) {
        this.data = data;
        this.hash = this.treeService.buildDataUpdateHierarchy(this.data, data);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
    }

    getDepartments(classes: any[]) :any {
        var dept: any[] = [];
        var subj: any[] = [];
        if (classes.length > 0) {
            classes.forEach(function (obj:any) {
                dept.push(obj.id);
                var children = obj.section;
                if (children.length > 0) {
                    children.forEach(function (obj: any) {
                        subj.push(obj)
                    });
                }
            });
        }

        return {dept: dept, subj: subj}
    }

}