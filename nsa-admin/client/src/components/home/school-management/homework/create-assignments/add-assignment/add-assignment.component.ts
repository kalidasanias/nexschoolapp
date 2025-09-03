/**
 * Created by Sai Deepak on 05-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService, TreeService} from "../../../../../../services/index";
import {Constants, ServiceUrls, Messages} from "../../../../../../common/index";
import {FileUploader} from "ng2-file-upload";
import {AttachmentComponent} from "../../../../common/attachment/attachment.component";
import {CommonService} from "../../../../../../services/common/common.service";
import {CreateAssignmentsComponent} from "../create-assignments.component";


@Component({
    selector: 'add-assignment',
    templateUrl: 'add-assignment.html'
})

export class AddAssignmentComponent implements OnInit {

    @ViewChild('single') single: ElementRef
    @ViewChild('singleSubject') singleSubject: ElementRef
    @ViewChild('selectFilter') selectFilter: ElementRef
    @ViewChild('dueDate') dueDate: ElementRef
    @ViewChild('radio') radio: ElementRef
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef

    modalId: any;
    assignment: any;
    subjects: any[];
    data: any[]= [];
    hash: any[];
    classes: any[];
    userType: any[];
    assignmentTypes: any[];
    users: any[];
    assignmentForm: any;
    oldStatus: any;
    assignmentDetails: any[];
    userDetails: any[];
    value: any;
    deleteObj: boolean = true;
    channels: any;
    notifedTo: any= 'All';
    attachments: any[] = [];
    existingAttachments: any;
    attachmentsForm: any = {};
    selectedNodes: any[] = [];
    taxonomy: any[] = [];
    feature:any[];
    objId: any;
    selectedStudents: any;
    queryData: any = {}
    nonDisabledNodes: any[] = []
    parent: CreateAssignmentsComponent;
    selectedSubjects: any[];

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private treeService: TreeService,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private messages: Messages) {
    }

    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', allowedMimeType: this.constants.allowFileTypes});

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
            form.append('uploadId', this.objId);
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.attachments.push(this.baseService.extractAttachment(response))
        }
        this.getSchoolSubjects();
        this.getLevelCategories();
        this.getAssignmentTypes();
        this.createForm();
        this.getFeatureChannelConfiguration();
        this.assignment = "";
        this.channels ="";
        this.parent = null;
        this.selectedSubjects = [];
    }

    createForm() {
        this.assignmentForm =  this.fb.group({
            'assignmentName': ['', Validators.required],
            'assignmentTypeId': '',
            'assignmentTypeName': '',
            'classes': '',
            'notifiedCategories': [],
            'assignmentDesc': [],
            'subjectId': '',
            'subjectName': '',
            'priority': 1,
            'notifiedTo': 'All',
            'dueDate': '',
            'status': '',
            'users': [],
            'attachment': [],
            'updatedUsername': '',
            "notify":  this.fb.group({
                "sms":'',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': this.constants.Sent
            })
        })
    }

    openOverlay(event:any, pParent: CreateAssignmentsComponent) {
        this.nonDisabledNodes = []
        this.resetForm();
        this.selectedStudents =[];
        this.baseService.removeHideClass('#viewAttachment');
        this.assignment = "";
        this.notifedTo = 'All';
        this.baseService.addRadioChecked('.radio1');
        this.baseService.removeRadioChecked('.radio2');
        this.baseService.addRadioChecked('.priorityHigh');
        this.baseService.removeRadioChecked('.priorityMed');
        this.baseService.removeRadioChecked('.priorityLow');
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        if(this.assignmentTypes.length > 0) {
            this.baseService.openOverlay(event);
        } else {
            this.baseService.showNotification('Assign Assignment Type', '', 'bg-danger');
        }
        this.parent = pParent;
    }


    closeOverlay(event:any) {
        this.baseService.closeOverlay('#addAssignment');
        this.reload();
        this.uploader.clearQueue();
    }

    getAssignment(event: any, value:any, pParent: CreateAssignmentsComponent) {
        this.modalId = event;
        this.value = value;
        this.parent = pParent;
        this.commonService.get(this.serviceUrls.getAssignment + '/' + event.target.value).then(
            feeType => this.callBack(feeType)
        );
    }

    callBack(value:any) {
        this.assignment = value;
        this.updateTree(value);
        this.editForm(value);
    }

    getSchoolSubjects() {
        this.commonService.get(this.serviceUrls.getActiveSchoolSubjects).then(
            subjects => this.callBackSubjects(subjects)
        )
    }

    callBackSubjects(value: any) {
        this.subjects = value;
        this.baseService.enableSelectWithEmpty('#bootstrap-subject', value, this.constants.subjectObj, null)
    }

    callBackClassSectionSubjects(value: any, error: boolean) {
        if (error) {
            this.baseService.showNotification(value, "", 'bg-danger');
            this.baseService.enableMultiSelectFilteringAll('#assignment-subject', [], this.constants.sectionSubObj, null);
        } else {
            this.baseService.enableMultiSelectFilteringAll('#assignment-subject', value, this.constants.sectionSubObj, this.selectedSubjects);
        }
    }

    getLevelCategories() {
        this.commonService.get(this.serviceUrls.getLevelCategories + "3").then(
            data => this.callBackData(data)
        )
    }

    callBackData(data:any) {
        this.data = data;
        this.taxonomy = data;
        this.hash = this.treeService.buildDataHierarchy(data);
        this.treeService.updateDisableNodes(this.hash, this.nonDisabledNodes)
    }

    getNonDisabledNodes(toggleNode: any) {
        this.nonDisabledNodes = [];
        var isAnyNodeSelected = false
        let handleChildren = (node:any) => {
            if(node.selected) {
                isAnyNodeSelected = true;
            }
            this.nonDisabledNodes.push(node['category_id'])
            node.children.forEach(function (child:any) {
                handleChildren(child);
            });
        }
        var parent = toggleNode.parent
        if(typeof parent != 'undefined' && parent != null && parent['category_id'] != "331dc52c-b36d-4c1b-a5ad-e2e402bfe485") {
            handleChildren(parent)
        } else {
            handleChildren(toggleNode)
        }
        if(!isAnyNodeSelected) {
            this.nonDisabledNodes = [];
        }
    }

    nodeSelected(toggleNode:any) {
        this.nonDisabledNodes = [];
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

        //this.baseService.addChecked('.radio1');
        updateParent(toggleNode);
        this.getNonDisabledNodes(toggleNode)
        this.treeService.updateDisableNodes(this.hash, this.nonDisabledNodes)
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
        this.getClassSectionSubjects(selected.classObject)
        this.selectedStudents = selected.classObject;
        this.queryData['classes'] = this.classes;
        this.baseService.addChecked('.radio1');
        this.baseService.selectStyle()
        this.baseService.addHideClass('.studentClass');
        // this.getUsersByClassAndSections(this.queryData);
    }

    getClassSectionSubjects(obj: any) {
        if(obj.length) {
            var classObj = obj[0];
            this.commonService.post(this.serviceUrls.getSubjectsByMultiSections, {
                sectionIds: classObj.section,
                classId: classObj.id,
                sections: this.classes[0]['sectionNode'],
            }).then(
                result => this.callBackClassSectionSubjects(result, false),
                error => this.callBackClassSectionSubjects(error, true))
        }
    }

    myUpdate(data: any[]) {
        this.data = data;
        this.hash = this.treeService.buildDataUpdateHierarchy(this.data, data);
        this.treeService.UpdateDisabledNodes(this.hash)
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
    }

    getAssignmentTypes() {
        this.commonService.get(this.serviceUrls.getAllAssignmentsTypes).then(
            types => this.callBackTypes(types)
        )
    }

    callBackTypes(value: any) {
        this.assignmentTypes = value;
        this.baseService.enableSelect('#assignment-select', value, this.constants.assignmentTypeObj, null);
    }

    getUsersByClassAndSections(value: any) {
        this.commonService.post(this.serviceUrls.getUsersByClassAndSections, value).then(
            users => this.callBackUsers(users)
        )
    }

    callBackUsers(data: any) {
        this.users = data;
        this.assignmentForm._value.users = this.users;
        if(this.notifedTo == 'Selected') {
            this.baseService.enableMultiSelectFilteringAll('.assignment-users', this.users, this.constants.userObject, null);
        }

    }

    saveAssignment(id: any) {
        if(this.notifedTo == 'All') {
            this.getAllUsers(this.queryData, id)
        } else {
            this.save(id)
        }
    }

    save(id: any) {
        this.setFormValues(id);
        var dataFound = this.setValidations();
        if(dataFound === true){
            if (this.assignment != "" && this.value != 'clone') {
                this.baseService.enableBtnLoading(id);
                this.assignmentForm._value.attachments = this.existingAttachments;
                this.commonService.put(this.serviceUrls.updateAssignment + this.assignment.id, this.assignmentForm._value).then(
                    result => this.saveAssignmentCallBack(result, id, false),
                    error => this.saveAssignmentCallBack(<any>error, id, true))

            } else {
                this.assignmentForm._value.updatedUsername = this.baseService.findUser().name;
                this.baseService.enableBtnLoading(id);
                this.assignmentForm._value.attachments = this.existingAttachments;
                this.commonService.post(this.serviceUrls.saveAssignment, this.assignmentForm._value).then(
                    result => this.saveAssignmentCallBack(result, id, false),
                    error => this.saveAssignmentCallBack(<any>error, id, true))
            }

        }
    }


    setValidations():any{
       var dataFound = false;
        if(this.classes == undefined || this.classes.length < 1) {
            this.baseService.showNotification('Select Class Details', "", 'bg-danger');
        } else if(this.assignmentForm._value.users.length < 1){
            this.baseService.showNotification('Please choose students',"", 'bg-danger');
        } else if(this.assignmentForm._value.subjects.length < 1){
            this.baseService.showNotification('Please Select Subjects',"",'bg-danger');
        } else if(this.assignmentForm._value.dueDate.length < 1){
            this.baseService.showNotification('Please Enter Date',"",'bg-danger');
        } else{
            dataFound = true;
        }
        return dataFound;
    }

    saveAssignmentCallBack(result:any, id:any, error:boolean) {
        this.objId = result.assignment_id;
        if(this.uploader.getNotUploadedItems().length) {
            this.uploader.uploadAll();
        } else {
            this.addAttachementsCallback(result, id, error)
        }
        this.uploader.onCompleteAll = () => {
            this.attachmentsForm['assignmentId'] = result.assignment_id;
            this.attachmentsForm['attachments'] = this.attachments;
            this.addAttachements(this.attachmentsForm, id)
        }
    }

    addAttachements(data: any, id: any) {
        this.commonService.put(this.serviceUrls.addAttachments + data.assignmentId, data).then(
            result => this.addAttachementsCallback(result, id, false),
            error => this.addAttachementsCallback(<any>error, id, true))
    }

    addAttachementsCallback(result: any, id:any , err: any) {
        this.attachments.pop();
        var successMsg = (id == "Sent" ? "Homework published successfully " : "Homework saved as draft");
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(successMsg , "", 'bg-success');
            this.baseService.closeOverlay('#addAssignment');
            this.resetTable();
            this.parent.save();
            this.resetForm();
            this.uploader.clearQueue();
			this.reload();
        }
        this.baseService.disableBtnLoading(id);
    }
    getDetails(data: any, value :any, key: any, compareKey: any) : any[] {
        var selectedObject :any[]= [];
        data.forEach(function (object:any) {
            for(let node in value) {
                if(object[key] == value[node][compareKey]) {
                    selectedObject.push(object);
                }
            }
        });
        return selectedObject;
    }


    setFormValues(id: any) {
        var selectedUsers: any[] = [];
        var arr: any[] = [];
        arr = this.treeService.getTreeJson(this.hash);
        if(id == 'Sent') {
            this.assignmentForm._value.status = true;
        } else {
            this.assignmentForm._value.status = false;
        }
        this.assignmentForm._value.taxanomy = this.baseService.removeCylicObj(this.taxonomy);
        this.assignmentForm._value.selectedNodes = this.selectedNodes;
        this.assignmentForm._value.notifiedCategories = arr;
        this.assignmentForm._value.notify.sms = this.sms.nativeElement.checked;
        this.assignmentForm._value.notify.email = this.email.nativeElement.checked;
        this.assignmentForm._value.notify.push = this.push.nativeElement.checked;
        this.assignmentForm._value.dueDate = this.dueDate.nativeElement.value;
        this.assignmentForm._value.subjects = this.baseService.extractOptions(this.singleSubject.nativeElement.selectedOptions);
        this.assignmentForm._value.assignmentTypeId = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].id;
        this.assignmentForm._value.assignmentTypeName = this.baseService.extractOptions(this.single.nativeElement.selectedOptions)[0].name;
        this.assignmentForm._value.notifiedTo = this.notifedTo;
        if(this.notifedTo == 'All') {
            this.assignmentForm._value.users = this.users;
        } else {
            selectedUsers = this.baseService.extractOptions(this.selectFilter.nativeElement.selectedOptions);
            this.assignmentForm._value.users = this.getDetails(this.users, selectedUsers, 'id', 'id');
        }

    }

    reload() {
        this.baseService.dataTableReload('datatable-assignment-export');
    }

    resetForm() {
        this.createForm();
        this.baseService.enableSelect('#assignment-select', this.assignmentTypes, this.constants.assignmentTypeObj, null);
        this.baseService.enableMultiSelectFilteringAll('#assignment-subject', [], this.constants.subjectObj, null);
        this.getLevelCategories();
        this.baseService.addHideClass('.studentClass');
        this.users = [];
        this.classes = [];
        this.selectedSubjects = [];
    }

    checkClass(value: any) {
        if(value == 'true') {
            this.notifedTo = 'All';
            this.baseService.addHideClass('.studentClass');
        } else {
            if(this.selectedStudents.length < 1) {
                this.baseService.showNotification("Select Class", "", 'bg-danger');
            } else {
                this.baseService.enableLoadingWithMsg('Updating...');
                this.getUsersByClassAndSections(this.queryData);
                this.notifedTo = 'Selected';
                //this.baseService.enableMultiSelectFilteringAll('.assignment-users', this.users, this.constants.userObject, null);
                this.baseService.removeHideClass('.studentClass');
            }
        }
    }

    editForm(form :any) {
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.existingAttachments = form.attachments;
        this.assignmentForm =  this.fb.group({
            'assignmentName': [form.assignmentName,Validators.required],
            'assignmentTypeId': form.assignmentTypeId,
            'assignmentTypeName': '',
            'assignmentDesc': form.assignmentDesc,
            'priority': form.priority,
            'dueDate': form.dueDate,
            'status': '',
            'attachment': [],
            'notifiedTo': '',
            'updatedUsername': form.updatedUsername,
            "notify":  this.fb.group({
                "sms": '',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': 'Sent'
            })
        })
        if(form.priority == 1) {
            this.baseService.addChecked('.priorityHigh');
        } else if(form.priority == 2) {
            this.baseService.addChecked('.priorityMed');
        } else {
            this.baseService.addChecked('.priorityLow');
        }

        this.oldStatus = form.status;
        this.notifedTo = form.notifyTo;
        this.baseService.enableSelect('#assignment-select', this.assignmentTypes, this.constants.assignmentTypeObj, form.assignmentTypeId);
        this.getClassSectionSubjects(this.classes);
        this.selectedSubjects = this.baseService.getObjectValues(form.subjects, 'id');
        // this.baseService.enableMultiSelectFilteringAll('#assignment-subject', this.subjects, this.constants.subjectObj, this.baseService.getObjectValues(form.subjects, 'id'));
        this.baseService.removeHideClass('#viewAttachment');
        this.baseService.openOverlay(this.modalId);

    }

    getAssignmentDetailsByAssignmentId(value: any, data: any) {
        this.commonService.get(this.serviceUrls.getAssignmentDetail + value).then(
            assignmentDetails => this.callBackAssignmentDetails(assignmentDetails, data)
        )
    }

    callBackAssignmentDetails(data: any, users: any) {
        this.assignmentDetails = data;
        var userDetails: any[] = [];
        userDetails = this.getDetails(users, data, 'userName', 'userName');
        this.baseService.enableMultiSelectFilteringAll('.assignment-users', this.users, this.constants.userObject, this.baseService.JsonToArray(userDetails, this.constants.userObject));
    }

    getUsers(value: any, data: any) {
        this.commonService.post(this.serviceUrls.getUsersByClassAndSections, value).then(
            users => this.callBackUsersDetails(users, data)
        )
    }

    callBackUsersDetails(users:any, data: any) {
        this.users = users;
        if(data.notifyTo == 'All') {
            this.baseService.addChecked('.radio1');
            this.baseService.addHideClass('.studentClass');
            this.getAssignmentDetailsByAssignmentId(data.id, users);
        } else {
            this.baseService.addChecked('.radio2');
            this.getAssignmentDetailsByAssignmentId(data.id, users);
            this.baseService.removeHideClass('.studentClass');
        }
    }

    updateTree(form: any) {
        this.myUpdate(JSON.parse(form.notifiedCategories));
        this.selectedStudents = this.classes;
        this.queryData['classes'] = this.classes;
        this.getUsers(this.queryData, form);
    }

    resetTable() {
        // this.baseService.enableSelectWithEmpty('#bootstrap-subject', this.subjects, this.constants.subjectObj, null);
        this.baseService.dataTableDestroy('datatable-assignment-export');
        // this.baseService.addHideClass('#sections');
        // this.baseService.enableDataTable(this.serviceUrls.getAssignments);
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature = data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    viewAttachment() {
        this.commonService.get(this.serviceUrls.getAssignment + '/' + this.assignment.id).then(
            assignment => this.callBackAttachment(assignment)
        );
    }

    callBackAttachment(value: any){
        this.assignment = value;
        this.assignment['url'] = this.serviceUrls.deleteAssignmentAttachement;
        if(this.value == "clone"){
            this.parent.attachmentComponent.openModal(this.assignment, false);
        } else{
            this.parent.attachmentComponent.openModal(this.assignment, true);
        }
    }

    getExistingFiles(event: any){
        this.existingAttachments = event.target.value;
    }

    getAllUsers(value: any, id: any) {
        if(Object.keys(value).length !== 0){
            this.commonService.post(this.serviceUrls.getUsersByClassAndSections, value).then(
                users => this.callBackAllUsers(users, id)
            )
        }else {
            this.baseService.showNotification('Select Class Details', "", 'bg-danger');
        }

    }

    callBackAllUsers(data: any, id: any) {
        this.users = data;
        this.save(id)
    }
}
