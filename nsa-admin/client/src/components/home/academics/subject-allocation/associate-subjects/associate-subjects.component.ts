/**
 * Created by Britto on 4/7/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService, TreeService} from "../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector: 'associate-subjects',
    templateUrl: 'associate-subjects.html'
})

export class AssociateSubjectsComponent implements OnInit {

    @ViewChild('selectAll') selectAll:ElementRef;

    /* private selectedOptions: number[];*/
    subjectArr:any[];
    modalId:any;
    subject:any;
    value:any[];
    hash:any[];
    data:any[] = [];
    selectedNodes: any[] = [];
    classes:any[];
    userType:any[];
    subjectAllocationform:any;
    subjectAllocation:any;
    subjectType:any;
    schoolSubjects:any[];
    template:any[];
    taxanomy:any[] = [];
    templates:any[];
    id:any;
    btnVal: any;
    subjects:any[];

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private treeService: TreeService,
                private constants: Constants,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                public messages: Messages) {
    }

    ngOnInit() {
        this.subjectAllocation = "",
        this.createForm();
        this.getLevelCategories();
        this.getSchoolSubjects();
        this.subject = "";
    }

    createForm() {
        this.subjectAllocationform = this.fb.group({
            'classes': [''],
            'subjectId': [''],
            'notifiedCategories': [],
            'subjectType': false,
        });
    }

    openOverlay(event:any) {
        this.btnVal = this.constants.Save;
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.classes = [];
        this.baseService.closeOverlay('#subjectAllocation');
    }

    saveSubjectAllocation(id:any) {
        var arrayValue = this.baseService.extractOptions(this.selectAll.nativeElement.selectedOptions);
        var subjectId = [];
        for (let i = 0; i < arrayValue.length; i++) {
            var subId = arrayValue[i].id;
            subjectId.push(subId);
        }
        this.subjectAllocationform._value.subjectId = subjectId;
        this.subjectAllocationform._value.classes = this.classes;
        this.subjectAllocationform._value.selectedNodes = this.selectedNodes;
        this.subjectAllocationform._value.taxanomy = this.baseService.removeCylicObj(this.taxanomy);
        var dataFound = this.setValidation();
        if (this.subjectAllocationform.valid && dataFound) {
            this.commonService.post(this.serviceUrls.saveSchoolClassSubjects, this.subjectAllocationform._value).then(
                result => this.saveSubjectAllocationCallBack(result, id, false),
                error => this.saveSubjectAllocationCallBack(<any>error, id, true))
        }
    }

    setValidation(){
        var dataFound = false;
        if(!this.classes || this.classes.length < 1 ){
            this.baseService.showNotification('Please Select Class', '', 'bg-danger');
        }else if(this.subjectAllocationform._value.subjectId.length < 1){
            this.baseService.showNotification('Please Select Subjects', '', 'bg-danger');
        }else {
            dataFound = true;
        }
        return dataFound;
    }


    saveSubjectAllocationCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.dataTableReload('datatable-allocation-export');
            this.closeOverlay(id);
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    getSchoolSubjects() {
        this.commonService.get(this.serviceUrls.getActiveSchoolSubjects).then(
            subjects => this.callBackSubjects(subjects)
        )
    }

    callBackSubjects(value:any) {
        this.schoolSubjects = value;
        this.baseService.enableMultiSelectFilteringAll('.multiselect-subject', this.schoolSubjects, this.constants.subjectAllocationObj, null);
    }

    getLevelCategories() {
        this.commonService.get(this.serviceUrls.getLevelCategories + "3").then(
            data => this.callBackData(data)
        )
    }

    callBackData(data:any) {
        this.data = data;
        this.taxanomy = data;
        this.hash = this.treeService.buildDataHierarchy(data);
    }

    nodeSelected(toggleNode:any) {
        this.baseService.addChecked('.priorityHigh');
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

        updateParent(toggleNode);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        this.classes = this.treeService.updateSelected(this.classes, this.userType, this.hash).classObject;
        var data = {};
        data['classes'] = this.classes;
    }

    resetForm() {
        this.createForm();
        this.subjectAllocation = "";
        this.getLevelCategories();
        this.baseService.enableMultiSelectFilteringAll('.multiselect-subject', this.schoolSubjects, this.constants.subjectAllocationObj, null);
    }

    checkClass(val: any) {
        this.subjectAllocationform._value.subjectType = val;
    }

}