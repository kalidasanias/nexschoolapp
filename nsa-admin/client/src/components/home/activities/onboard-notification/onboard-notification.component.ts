/**
 * Created by anjan on 8/18/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiceUrls} from "../../../../common/index";
import {CommonService} from "../../../../services/common/common.service";
import {Constants} from "../../../../common/constants/constants";
import {BaseService, TreeService} from "../../../../services/index";

@Component({
    templateUrl: 'onboard-notification.html'
})

export class OnboardNotificationComponent implements OnInit{
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef
    @ViewChild('radio') radio: ElementRef

    data:any[] = [];
    hash : any [] = [];
    taxanomy: any[]= [];
    selectedNodes: any[] = [];
    classes:any[];
    userType:any[];
    onBoardNotificationform: any;
    status: any;
    notificationId: any;
    user: any;
    viewOnboard: boolean = false;
    smsObject: boolean = true;
    userTypes: any= 'Student';
    enable: any;

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private treeService: TreeService,
                private constants : Constants,
                private formBuilder: FormBuilder) { }
    ngOnInit() {
        this.baseService.setTitle('NSA - Onboard Notifications');
		this.enable = this.baseService.havePermissionsToEdit(this.constants.NOTIFICATION_PERMISSIONS);
        this.user = this.baseService.findUser();
        this.baseService.enableDataTable(this.serviceUrls.OnboardNotification + this.user.user_name);
        this.baseService.enableAppJs();
        this.getFeatureChannelConfiguration();
        this.getLevelCategories();
        this.createForm();
    }


    createForm(){
       this.onBoardNotificationform = this.formBuilder.group({
            'notificationName': ['',  Validators.required],
            "notify":  this.formBuilder.group({
               "sms":'',
               "email": '',
               "push": ''
            }),
           'notifyTo': this.formBuilder.group({
               'status': this.constants.Sent
           }),
           classes: ['']
        });
    }

    openOverlay(event: any) {
        this.userTypes = 'Student';
        this.viewOnboard = false;
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#onboardModel');
    }

    saveNotification(id:any) {
        this.setFormValues();
        var dataFound = this.setValidation();
        if (this.onBoardNotificationform.valid && dataFound) {
            this.onBoardNotificationform._value.notifyTo.status = id;
            this.baseService.enableBtnLoading(id);
            this.commonService.post(this.serviceUrls.OnboardNotification, this.onBoardNotificationform._value).then(
                result => this.saveNotificationCallBack(result, id, false),
                error => this.saveNotificationCallBack(<any>error, id, true))
        }
    }

    checkLogins(value: any) {
        this.userTypes = value == 'true' ? 'Parent' : 'Student';
    }

    getNotificationById(event:any) {


        this.viewOnboard=true;
        var value = JSON.parse(event.target.value);
        this.commonService.get(this.serviceUrls.getNotificationById + '/' + value.notification_id)
            .then(notification => this.callBackNotification(event, notification))
    };

    callBackNotification(event: any, res:any) {
        this.notificationId = res[0].notification_id;
        this.onBoardNotificationform = this.formBuilder.group({
            'notificationName': [res[0].title,  Validators.required],
            "notify":  this.formBuilder.group({
                "sms":'',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.formBuilder.group({
                'status': res[0].status
            }),
            'classes': [],
        });
        if(res[0].user_types){
            this.userTypes = res[0].user_types[0];
        }else {
            this.userTypes = 'Student';
        }

        var updateData = res[0].notified_categories == null ? this.taxanomy : JSON.parse(res[0].notified_categories);
        this.myUpdate(updateData);
        this.baseService.openOverlay(event);
    };

    myUpdate(data: any[]) {
        this.data = data;
        this.hash = this.treeService.buildDataUpdateHierarchy(this.data, data);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
        this.userType = selected.userType;
    }

        setFormValues() {
        this.onBoardNotificationform._value.classes = this.classes;
        this.onBoardNotificationform._value.notify.sms = this.sms.nativeElement.checked;
        this.onBoardNotificationform._value.notify.email = this.email.nativeElement.checked;
        this.onBoardNotificationform._value.notify.push = this.push.nativeElement.checked;
        this.onBoardNotificationform._value.taxanomy = this.baseService.removeCylicObj(this.taxanomy);
        this.onBoardNotificationform._value.userTypes = this.userTypes;
        this.onBoardNotificationform._value.selectedNodes = this.selectedNodes;

        var arr:any[] = [];
        arr = this.treeService.getTreeJson(this.hash);
        this.onBoardNotificationform._value['notifiedCategories'] = arr;
    }

    setValidation(){
        var dataFound = false;
        if(!this.classes || this.classes.length < 1 ){
            this.baseService.showNotification('Please Select Class', '', 'bg-danger');
        }else {
            dataFound = true;
        }
        return dataFound;
    }

    saveNotificationCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#onboardModel');
            this.baseService.dataTableReload('datatable-onboard');
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    resetForm() {
        this.createForm();
        this.notificationId = '';
        this.getLevelCategories();
        this.classes = [];
        this.userType = [];
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
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
        this.userType = selected.userType;
        var data = {};
        data['classes'] = this.classes;
    }


    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.commonService.getActiveFeatureChannelDetails(data);
    }


}