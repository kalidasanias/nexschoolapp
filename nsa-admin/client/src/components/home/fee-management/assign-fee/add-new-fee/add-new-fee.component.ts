/**
 * Created by senthil on 1/25/2017.
 */
import {Component, DoCheck, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {BaseService, TreeService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
declare var jQuery: any;

@Component({
    selector: 'add-new-fee',
    templateUrl: 'add-new-fee.html'
})
export class AddNewFeeComponent implements OnInit {

    @ViewChild('selectAll') selectAll: ElementRef
    @ViewChild('multi') multi: ElementRef
    @ViewChild('multiFilter') multiFilter: ElementRef
    @ViewChild('single') single: ElementRef
    @ViewChild('line') line: ElementRef
    @ViewChild('dueDate') dueDate: ElementRef
    @ViewChild('dueDate1') dueDate1: ElementRef
    @ViewChild('totalFeeAmount') totalFeeAmount:ElementRef

    feeStructures: any[];
    languages: any[];
    feeStructure: any;
    feeAssignmentId: any;
    options: any[];
    feeAssignmentForm: any;
    totalAmount: any;
    netAmount: any;
    modalId: any;
    feeAssignment: any;
    feeDetails: any;
    data: any[]= [];
    hash: any[];
    btnVal: string
    classes: any[];
    userType: any;
    feeDetailsForm: any;
    feeScholarships: any;
    feeUsers: any;
    langArr: any[];
    scholarshipDetails: any[];
    selectedScholars: any[];
    amount : any;
    feeAssignmentDetails: any;
    feeAssignmentDetailObj: any[];
    feeTypes: any[];
    details: any;
    feeScholarshipDetails: any;
    modalView: any;
    scholarUsers: any[];
    feeAssignmentDetailId: any[] = [];
    scholarDetails: any[] = [];
    selectedNodes: any[] = [];
    taxanomy: any[] = [];
    scholarUserValue: any= '00000000-0000-0000-0000-000000000000';

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private treeService: TreeService,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls : ServiceUrls) {

    }

    ngOnInit() {
        this.getAllActiveFeeNames();
        this.getAllLanguages();
        this.feeStructure = "";
        this.createForm();
        this.getAllCategories();
        this.feeAssignment = "";
        this.feeDetails="";
        this.createDetailsForm();
        this.getValidFeeScholarships();
        this.getAllFeeTypes();
        this.selectedScholars =[];
        this.feeScholarshipDetails = "";
    }

    updateDate(event:any) {
        this.feeAssignmentForm.controls['dueDate'].setValue(this.dueDate.nativeElement.value);
    }

    createForm() {
        this.feeAssignmentForm =  this.fb.group({
            'feeAssignmentName': '',
            'feeDetailObj': [],
            'classes': [],
            'languages': [],
            'feeTypes': [],
            'totalFeeAmount': {value: '',  disabled: true},
            'updatedBy': '',
            'updatedUsername': '',
            'dueDate': '',
            'assignedCategories': [],
            'createdDate': '',
            'oldTotalFeeAmount': '',
            'termId': '',
            'termName': ''
        })
    }

    createDetailsForm() {
        this.feeDetailsForm =  this.fb.group({
            'feeName': '',
            'totalFeeAmount': [],
            'scholarShip': [],
            'feeDiscountName': '',
            'feeDiscountAmount': '',
            'dueDate1': this.feeDetails.dueDate,
            'netAmount': '',
            'paidDate': '',
            'createdDate': '',
            'status': false

        })
    }

    editForm(form :any) {
        this.btnVal = 'Update';
        this.feeAssignmentForm =  this.fb.group({
            'feeAssignmentName': form.feeAssignmentName,
            'totalFeeAmount': form.totalFeeAmount,
            'dueDate': form.dueDate
        })
        this.langArr = this.baseService.JsonToArray(form.languages, this.constants.generalObj);
        /*this.details = this.baseService.checkValueInData(this.feeStructures, form.feeAssignmentName, 'feeStructureId');*/
        this.getFeeAssignment(form.feeAssignmentId);
        this.myUpdate(JSON.parse(form.assignedCategories));
        this.baseService.dataTableDestroy('datatable-scholarship-users');
        this.baseService.dataTableDestroy('datatable-fee-details');
        var feeAssignmentId = form.feeAssignmentId;
        if(this.modalView == this.constants.clone) {
            feeAssignmentId = this.scholarUserValue;
        }
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getFeeScholarshipUsers + feeAssignmentId);
        this.baseService.enableMultiSelectAll('.select-languanges', this.languages, this.constants.languageObj, this.langArr);
        this.getFeeAssignedUsers(form.feeAssignmentId);
        this.baseService.enableSelect('#single-select',this.feeStructures, this.constants.feeStructureObj, form.feeStructureId);
        this.feeScholarshipDetails = form.feeTypes;
        this.baseService.openOverlay(this.modalId);

    }

    openOverlay(event:any) {
        jQuery('#savefee').html('Save');
        jQuery('#saveFeeScholarship').html('Save');
        if(this.feeStructures.length > 0) {
            this.baseService.addDisabled('#addScholar');
            this.baseService.dataTableDestroy('datatable-scholarship-users');
            this.baseService.dataTableDestroy('datatable-fee-details');
            this.baseService.enableDataSourceDatatable(this.serviceUrls.getFeeScholarshipUsers + this.scholarUserValue);
            this.baseService.enableSelect('#single-select',this.feeStructures, this.constants.feeStructureObj, null);
            this.scholarUsers = [];
            this.feeDetails = "";
            this.feeScholarshipDetails = "";
            this.getFeeTypesById();
            this.resetForm();
            this.baseService.openOverlay(event);
        } else {
            this.baseService.showNotification('Assign Fee Structure', '', 'bg-danger');
        }
    }

    closeOverlay(event:any) {
        this.totalAmount = "";
        this.createForm();
        this.feeAssignment = "";
        this.feeScholarshipDetails = [];
        this.getAllCategories();
        this.baseService.enableMultiSelectAll('.select-languanges', this.languages, this.constants.languageObj, null);
        this.baseService.enableSelect('#single-select',this.feeStructures, this.constants.feeStructureObj, null);
        this.createDetailsForm();
        this.baseService.closeOverlay('#addNewFee');
        this.baseService.removeDisabled('#savefee');
    }

    save(id: any) {
        this.setFormValues();
        this.totalAmount = this.totalFeeAmount.nativeElement.value;
        this.feeAssignmentForm._value.totalFeeAmount = (this.totalAmount).toString();
         if(this.feeAssignmentForm.valid){
             var dataFound = this.setValidations();
             if(dataFound === true){
				 this.baseService.enableBtnLoading(id);
                 if(this.feeDetails.feeAssignmentId == undefined || this.modalView == this.constants.clone) {
                     this.commonService.post(this.serviceUrls.saveFeeAssignment, this.feeAssignmentForm._value).then(
                         result => this.saveFeeAssignmentCallBack(result, id, false, 'post'),
                         error => this.saveFeeAssignmentCallBack(<any>error, id, true, 'post'))

                 } else {
                     this.updateValue(this.feeDetails, this.feeAssignmentForm);
                     this.commonService.put(this.serviceUrls.updateAssignFeeAndDetails + this.feeDetails.feeAssignmentId, this.feeAssignmentForm._value).then(
                         result => this.saveFeeAssignmentCallBack(result, id, false, 'put'),
                         error => this.saveFeeAssignmentCallBack(<any>error, id, true, 'put'))
                 }
             }

        }
    }

    setValidations() : any {
        var dataFound = false;
        if(this.feeAssignmentForm._value.languages.length < 1) {
            this.baseService.showNotification("Please Select Language", "", 'bg-danger');
        } else if (this.feeAssignmentForm._value.classes ==undefined || this.classes.length < 1) {
            this.baseService.showNotification('Select Class Details', "", 'bg-danger');
        } else if(this.totalAmount == 0){
            this.baseService.showNotification('Please Enter Amount',"",'bg-danger');
        } else if(this.feeAssignmentForm._value.dueDate.length < 1){
            this.baseService.showNotification('Please Select Date',"",'bg-danger');
        }
        else {
            dataFound = true;
        }
        return dataFound;
    }

    saveFeeAssignmentCallBack(result:any, id:any, error:boolean, method: any){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.dataTableReload('datatable-fee-export');
            this.reload();
            this.feeAssignmentId = result.feeAssignmentId
            this.baseService.removeDisabled('#addScholar');
            this.getFeeAssignedUsers(this.feeAssignmentId);
        }
        this.baseService.disableBtnLoading(id);
        if(method == 'post') {
            this.baseService.addDisabled('#savefee');
        }

    }

    getAllActiveFeeNames() {
        this.commonService.get(this.serviceUrls.getActiveFeeStructures).then(
            feeStructure => this.callBackFeeNames(feeStructure)
        )
    }

    callBackFeeNames(data: any) {
        this.feeStructures = data;
        if(data.length > 0) {
            this.baseService.enableSelect('#single-select',data, this.constants.feeStructureObj, null);
            this.getFeeTypesById();
        }
    }

    getAllLanguages() {
        this.commonService.get(this.serviceUrls.getAllLanguages).then(
            languages => this.callBackLanguages(languages)
        )
    }

    callBackLanguages(data: any) {
        this.languages = data;
        this.baseService.enableMultiSelectAll('.select-languanges', data, this.constants.languageObj, null);
    }

    getFeeTypesById() {
        this.options = this.baseService.extractOptions(this.single.nativeElement.selectedOptions);
        if (this.options[0].id) {
            this.commonService.get(this.serviceUrls.getFeeStructure + this.options[0].id).then(
                feeStructure => this.callBackFeeType(feeStructure)
            )
        }
    }

    callBackFeeType(data: any) {
        this.feeStructure = data;
        this.feeScholarshipDetails = this.getDetails(this.feeTypes, data.applicableFeeTypes, 'id', 'id');
    }

    getTotatlAmount(){
        this.totalAmount = this.baseService.extractAmount(this.line.nativeElement.children);
        this.feeAssignmentForm._value.totalFeeAmount = (this.totalAmount).toString();
    }
    getNetAmount() {
        this.amount = this.getScholarShipAmount(this.selectedScholars);
        this.netAmount = this.feeDetailsForm._value.totalFeeAmount - (+this.feeDetailsForm._value.feeDiscountAmount + +this.amount);
        this.netAmount = this.netAmount > 0 ? this.netAmount : 0;
        this.feeDetailsForm._value.netAmount = (this.netAmount).toString();
    }

    /*ngDoCheck() {
        setTimeout(() => {
            this.getTotatlAmount();
            this.getNetAmount();
        }, 300);
    }
*/
    keydown() {
        setTimeout(() => {
            this.getTotatlAmount();
            this.getNetAmount();
        }, 100);
    }

    keyup(event:any) {
        var charCode = (event.which) ? event.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }

    getFeeAssignmentById(id: any, value:any, event: any){
        this.modalId = event;
        this.modalView = id;
        this.getScholarshipUsersById(event.target.value);
        this.baseService.addDisabled('#addScholar');
        this.commonService.get(this.serviceUrls.getFeeAssignment + event.target.value).then(
            feeType => this.callBack(feeType)
        );
    }

    callBack(value: any) {
        this.feeAssignment = value;
        this.editForm(value);
    }

    resetForm(){
        this.totalAmount = "";
        this.createForm();
        this.feeAssignment = "";
        this.feeScholarshipDetails = [];
        this.getAllCategories();
        this.baseService.enableMultiSelectAll('.select-languanges', this.languages, this.constants.languageObj, null);
        this.feeScholarshipDetails = this.getDetails(this.feeTypes, this.feeStructure.applicableFeeTypes, 'id', 'id');
        this.baseService.enableSelect('#single-select',this.feeStructures, this.constants.feeStructureObj, null);
        this.createDetailsForm();
    }

    updateValue(form: any, updateForm: any) {
        updateForm._value.createdDate = form.createdDate;
        updateForm._value.feeDetailObj = this.feeUsers;
        if(this.classes == undefined){
            updateForm._value.classes = form.classes;
        }
        updateForm._value.oldTotalFeeAmount = form.totalFeeAmount;
    }


    getAllCategories() {
        this.commonService.get(this.serviceUrls.getFeeCategories).then(
            data => this.callBackData(data)
        )
    }

    callBackData(data:any) {
        this.data = data;
        this.taxanomy = data;
        this.hash = this.treeService.buildDataHierarchy(data);
    }

    nodeSelected(toggleNode:any) {

        // select / unselect all children (recursive)
        let toggleChildren = (node:any) => {
            node.children.forEach(function (child:any) {
                child.selected = node.selected;
                if (child.children.length) {
                    toggleChildren(child);
                }
            });
        }
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

        toggleChildren(toggleNode);
        updateParent(toggleNode);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
    }

    myUpdate(data: any[]) {
        this.data = data;
        this.hash = this.treeService.buildDataUpdateHierarchy(this.data, data);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
    }

    getFeeAssignment(id: any) {
        this.commonService.get(this.serviceUrls.getFeeAssignment + id).then(
            feeType => this.callBackFeeTypeAss(feeType)
        );
    }

    getFeeAssignment1(id: any) {
        this.commonService.get(this.serviceUrls.getFeeAssignment + id).then(
            feeType => this.callBackFeeTypeAss1(feeType)
        );
    }

    callBackFeeTypeAss1(form: any) {
        this.feeDetails = form;
        this.feeAssignmentId = this.feeDetails.feeAssignmentId
        this.baseService.disableDivLoading('#addNewFee');
        this.netAmount = Number(this.feeDetails.totalFeeAmount);
        this.editDetailsForm(this.feeDetails);
        this.baseService.openModal('addStudent');
    }


    callBackFeeTypeAss(form: any) {
        this.feeDetails = form;
        this.feeAssignmentId = this.feeDetails.feeAssignmentId
    }

    getValidFeeScholarships() {
        this.commonService.get(this.serviceUrls.getValidFeeScholarships).then(
            feeScholarships =>  this.callBackFeeScholarship(feeScholarships)
        )
    }

    callBackFeeScholarship(data: any) {
        this.feeScholarships = data;
        this.baseService.enableMultiSelect('.scholar', data , this.constants.feeScholarObj, null);
    }

    getFeeAssignedUsers(id: any) {
        this.commonService.get(this.serviceUrls.getFeeAssignedUser + id).then(
            feeUsers => this.callBackFeeUsers(feeUsers)
        )
    }

    callBackFeeUsers(data: any){
        this.feeUsers = data;
        this.baseService.enableMultiSelectFilteringAll('.filter', data , this.constants.feeUsersObj, null);
    }

    getScholarshipByIds() {
        this.scholarshipDetails = [];
        this.selectedScholars = this.getDetails(this.feeScholarships, this.baseService.extractOptions(this.multi.nativeElement.selectedOptions), 'id', 'id')
        this.netAmount = this.getScholarShipAmount(this.selectedScholars);
        this.feeDetailsForm._value.netAmount = (this.netAmount).toString();
    }

    getDetails(data: any, value :any, key: any, compareKey: any) : any[] {
        var selectedScholar :any[]= [];
        data.forEach(function (feeScholar:any) {
            for(let node in value) {
                if(feeScholar[key] == value[node][compareKey]) {
                    selectedScholar.push(feeScholar);
                }
            }
        });

        return selectedScholar;
    }

    getScholarShipAmount(data: any[]) : any {
        var amount : any = 0;
        if(data.length > 0) {
            data.forEach(function (feeScholar:any) {
                amount = amount + feeScholar.amount
            })
        }
        return amount;
    }

    saveFeeDetails(id: any) {
        this.baseService.enableBtnLoading(id);
        this.feeDetailsForm._value.scholarShip = this.selectedScholars;
        this.feeDetailsForm._value.dueDate1 = this.dueDate1.nativeElement.value;
        this.feeAssignmentDetailObj = this.getDetails(this.feeUsers, this.baseService.extractOptions(this.multiFilter.nativeElement.selectedOptions), 'feeAssignmentDetailId', 'id');
        this.feeDetailsForm._value.feeAssignmentDetail = this.feeAssignmentDetailObj;
        this.feeDetailsForm._value.netAmount = (this.netAmount).toString();
        if(this.feeDetailsForm.valid) {
            this.commonService.put(this.serviceUrls.updateFeeAssignmentDetail, this.feeDetailsForm._value).then(
                result => this.saveFeeAssignmentDetailsCallBack(result, id, false),
                error => this.saveFeeAssignmentDetailsCallBack(<any>error, id, true))
        }
    }

    saveFeeAssignmentDetailsCallBack(result: any, id: any, error: boolean){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
            this.baseService.disableBtnLoading(id);

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.dataTableReload('datatable-fee-export');
            this.baseService.closeModal('addStudent');
            this.baseService.disableBtnLoading(id);
            this.closeOverlay(id);
        }
    }

    delFeeAssignmentDetailsCallBack(result: any, error: boolean){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.dataTableReload('datatable-fee-export');
            this.baseService.dataTableReload('datatable-scholarship-users');
        }
    }

    getFeeAssignmentDetailsById(id: any, value: any) {
        this.commonService.get(this.serviceUrls.getFeeAssignmentDetail + value).then(
            feeDetails => this.feeAssignmentDetails = feeDetails
        )
    }

    getAllFeeTypes() {
        this.commonService.get(this.serviceUrls.getFeeTypes).then(
            feeTypes => this.feeTypes = feeTypes
        )
    }

    getScholarshipUsersById(id: any) {
        this.commonService.get(this.serviceUrls.getFeeScholarshipUsers + id).then(
            scholarUsers => this.scholarUsers = scholarUsers
        )
    }


    requested_delete1(event: any) {
        if(!this.baseService.isEmptyObject(event.target.value)) {
            var value = JSON.parse(event.target.value);
            value.scholarShip = [];
            value.netAmount = (Number(value.netAmount) + value.totalScholarshipAmount + Number(value.feeDiscountAmount)).toString() ;
            value.feeDiscountName = "";
            value.feeDiscountAmount = 0;
            value.status = false;
            if(value != undefined){
                this.commonService.put(this.serviceUrls.saveFeeAssignmentDetail + value.feeAssignmentDetailId, value).then(
                    result => this.delFeeAssignmentDetailsCallBack(result, false),
                    error => this.delFeeAssignmentDetailsCallBack(<any>error, true))
            }
        }
    }

    requested_warning() {
        this.baseService.showWarning();
    }

    reload() {
        this.baseService.dataTableReload('datatable-scholarship-users');
    }

    editFeeAssignmentDetail(id: any, event: any) {
        this.commonService.get(this.serviceUrls.getFeeAssignmentDetail + event.target.value).then(
            detail => this.callBackDetail(id, detail)
        )
    }

    callBackDetail(id: any, value: any) {
        this.editFeeDetailForm(id, value, this.feeDetails);
    }

    editFeeDetailForm(id: any, data: any, form: any) {
        this.feeAssignmentDetailId = [];
        this.feeDetailsForm =  this.fb.group({
            'feeName': form.feeAssignmentName,
            'totalFeeAmount': form.totalFeeAmount,
            'feeDiscountName': data.feeDiscountName,
            'feeDiscountAmount': data.feeDiscountAmount,
            'dueDate': data.dueDate,
            'netAmount': data.netAmount,
            'status': false
        })
        this.feeAssignmentDetailId.push(data.feeAssignmentDetailId);
        this.scholarDetails = this.baseService.JsonToArray(data.scholarShip, this.constants.feeScholarObj);
        this.baseService.enableMultiSelectFilteringAll('.filter', this.feeUsers , this.constants.feeUsersObj, this.feeAssignmentDetailId);
        this.baseService.enableMultiSelect('.scholar', this.feeScholarships , this.constants.feeScholarObj, this.scholarDetails);
        this.getScholarshipByIds();
        this.netAmount = data.netAmount;
        this.baseService.openModal(id);
    }

    showScholarship(id: any) {
        this.getFeeAssignment1(this.feeAssignmentId);
        this.netAmount = "";
        this.selectedScholars = [];
        this.baseService.enableMultiSelect('.scholar', this.feeScholarships , this.constants.feeScholarObj, null);
        this.getFeeAssignedUsers(this.feeAssignmentId);
    }


    editDetailsForm(form: any) {
       
        this.feeDetailsForm =  this.fb.group({
            'feeName': form.feeAssignmentName,
            'totalFeeAmount': form.totalFeeAmount,
            'scholarShip': [],
            'feeDiscountName': '',
            'feeDiscountAmount': '',
            'dueDate1': form.dueDate,
            'netAmount': '',
            'paidDate': '',
            'createdDate': '',
            'status': false
        })
    }

    setFormValues() {
        this.feeAssignmentForm._value.feeTypes = this.baseService.extractTableData(this.line.nativeElement.children);
        this.feeAssignmentForm._value.languages = this.baseService.extractOptions(this.selectAll.nativeElement.selectedOptions);
        this.feeAssignmentForm._value.dueDate = this.dueDate.nativeElement.value;
        this.feeAssignmentForm._value.feeAssignmentName = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].name;
        this.feeAssignmentForm._value.feeStructureId = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].id;
        this.feeAssignmentForm._value.classes = this.classes;
        this.feeAssignmentForm._value.updatedBy =this.baseService.findUser().id;
        this.feeAssignmentForm._value.updatedUsername =this.baseService.findUser().name;
        var structure: any = {};
        structure = this.baseService.checkValueInData(this.feeStructures, this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].id, this.constants.feeStructureId)
        var arr:any[] = [];
        arr = this.treeService.getTreeJson(this.hash);
        this.feeAssignmentForm._value.assignedCategories = arr;
        this.feeAssignmentForm._value.termId = structure.terms[0].id;
        this.feeAssignmentForm._value.termName = structure.terms[0].name;
        this.feeAssignmentForm._value.taxanomy = this.baseService.removeCylicObj(this.taxanomy);
        this.feeAssignmentForm._value.selectedNodes = this.selectedNodes;
    }
}

