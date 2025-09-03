/**
 * Created by bharatkumarr on 25/04/17.
 */

import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BaseService, TransportService } from '../../../../../services/index';
import { Constants, ServiceUrls } from '../../../../../common/index';
import {isNullOrUndefined} from "util";
import {ValidationService} from "../../../../../services/validation/validation.service";
import {CommonService} from "../../../../../services/common/common.service";
import {TreeService} from "../../../../../services/tree/tree.service";
declare var moment: any;
declare var Date: any;

@Component({
    selector: 'schedule-voice',
    templateUrl: 'schedule-voice.html'
})


export class ScheduleVoiceComponent implements OnInit {

    @ViewChild('audio') audio: ElementRef;
    @ViewChild('schedule_date') schedule_date: ElementRef;

    show: any;
    data:any[] = [];
    hash : any [] = [];
    media:any;
    templateForm:any;
    notificationId:any = '';
    classes: any[] = [];
    userType: any[] = [];
    selectedNodes:any[] = [];
    taxanomy: any[]= [];
    users: any[];
    audios: any[];
    enable: boolean = false;
    enableData: boolean = false;
    scheduleTime: Date = null;
    scheduleDate: Date = null;


    constructor(private baseService: BaseService,
                private formBuilder: FormBuilder,
                private commonService: CommonService,
                private treeService: TreeService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit() {
        this.createForm();
        this.getAudios();
        this.getMediaCount();
        this.getAllCategories();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.VOICE_PERMISSIONS)
        this.baseService.enablePickerDateByElement('#pickupDate');
    }

    createForm() {
        this.templateForm = this.formBuilder.group({
            'phoneNo': [],
            'notifiedCategories': [],
            'createdDate': [],
            'notificationId': this.notificationId,
            'selectedNodes': [],
            'taxanomy': [],
            notifyTo: this.formBuilder.group({
                'userType': [],
                'status': ['Sent'],
                'count': ['1']
            }),
            notifyFrom: this.formBuilder.group({
            }),
            notify: this.formBuilder.group({
                "sms":false,
                "email": false,
                "push": false

            }),
            'audio_id': '',
            'schedule_date': null,
            'name': ['', Validators.required],
            'classes': [''],
            'users': []
        });
        this.enableData = true;
    }

    getAudios() {
        this.commonService.get(this.serviceUrls.audioUrl)
            .then(audios => this.callbackAudios(audios));
    }

    updateDate(event:any) {
        this.scheduleDate = event.target.value;
        if (this.scheduleTime)   {
            var scheduleDate = new Date(event.target.value);
            scheduleDate.setHours(this.scheduleTime.getHours(), this.scheduleTime.getMinutes(), this.scheduleTime.getSeconds());
            this.templateForm.controls.schedule_date.setValue(scheduleDate.toString());
        }
    }

    getScheduleTime(event:Date) {
        this.scheduleTime = event;
        if (event && this.scheduleDate) {
            event.setSeconds(0);
            var scheduleDate = new Date(this.scheduleDate);
            scheduleDate.setHours(event.getHours(), event.getMinutes(), event.getSeconds());
            this.templateForm.controls.schedule_date.setValue(scheduleDate.toString());
        }
    }

    callbackAudios(audios: any) {
        this.audios = audios;
        this.baseService.enableSelectWithEmpty('#audios', this.audios, [ 'name', 'id' ], null);
    }

    getMediaCount() {
        this.commonService.get(this.serviceUrls.voiceCountUrl)
            .then(media => this.media = media);
    }

    getNotification(event: any){
        var value = JSON.parse(event.target.value);
        this.commonService.get(this.serviceUrls.scheduleVoiceNow + '/' + value.notification_id)
            .then(notification => this.callBackNotification(event, notification))
    }


    callBackNotification(event: any, res:any) {
        if (res[0].status === 'Draft' || res[0].status === 'Sent') {
            this.show = 'pick';
            this.notificationId = res[0].notification_id;
            this.scheduleDate = moment(res[0].schedule_date).format('LL');
            this.scheduleTime = new Date(res[0].schedule_date);
        }
        this.templateForm = this.formBuilder.group({
            'notifiedCategories': [],
            'phoneNo': res[0].notified_mobile_numbers != null ? res[0].notified_mobile_numbers.toString() : [''],
            'schedule_date': res[0].schedule_date,
            'createdDate': res[0].created_date,
            'notificationId': [res[0].notification_id],
            'notifyTo': this.formBuilder.group({
                'userType': '',
                'status': [res[0].status],
                'count': ['1']
            }),
            'notifyFrom': this.formBuilder.group({
            }),
            'notify': this.formBuilder.group({
                sms: [true, Validators.required]
            }),
            'audio_id': res[0].audio_id,
            'taxanomy': [],
            'name': [res[0].campaign_name, Validators.required],
            'classes': [''],
            'selectedNodes': [],
            'users': []
        });

        var updateData = res[0].notified_categories == null ? this.taxanomy : JSON.parse(res[0].notified_categories);
        this.myUpdate(updateData);
        this.baseService.enableSelectWithEmpty('#audios', this.audios, [ 'name', 'id' ], res[0].audio_id);
        this.baseService.openOverlay(event);

    }


    myUpdate(data: any[]) {
        this.data = data;
        this.hash = this.treeService.buildDataUpdateHierarchy(this.data, data);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
        this.userType = selected.userType;
    }

    getAllCategories() {
        this.commonService.get(this.serviceUrls.getAllCategoriesUrl).then(
            data => this.callBackData(data)
        )
    }

    callBackData(data:any) {
        this.data = data;
        this.taxanomy = data;
        this.hash = this.buildDataHierarchy(data);
    }

    buildDataHierarchy(data:any[]):any {
        let id = 1;
        let hash = {};
        let setNodeID = (node:any, parentId:number) => {
            hash[id] = node;
            node['selected'] = false;
            node['nodeId'] = id;
            node['parentNodeId'] = parentId;
            if (node.children.length) {
                const parentId = id;
                node.children.forEach(function (node:any) {
                    id++;
                    setNodeID(node, parentId);
                });
            }
            id++;
        }
        data.forEach(function (node:any) {
            node['expanded'] = true;
            setNodeID(node, 0);
        });
        return hash;
    }

    nodeSelected(toggleNode:any) {
        // select / unselect all children (recursive)
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
        this.users = this.treeService.updateEmpSelected(this.hash);
        this.classes = selected.classObject;
        this.userType = selected.userType;

    }

    openOverlay(event: any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.resetForm();
        this.baseService.closeOverlay('#scheduleVoice');
    }

    saveNotification(id: any) {
        var dataFound = this.setValidations(id);
        if (this.templateForm.valid && dataFound) {
            if (this.notificationId != '') {
                this.baseService.enableBtnLoading(id);
                this.commonService.put(this.serviceUrls.scheduleVoiceNow + '/' + this.notificationId, this.templateForm._value).then(
                    result => this.saveNotificationCallBack(result, id, false),
                    error => this.saveNotificationCallBack(<any>error, id, true))

            } else {
                this.baseService.enableBtnLoading(id);
                this.commonService.post(this.serviceUrls.scheduleVoiceNow, this.templateForm._value).then(
                    result => this.saveNotificationCallBack(result, id, false),
                    error => this.saveNotificationCallBack(<any>error, id, true))
            }
        }
    }
    setValidations(id: any):any {
        var dataFound =false;
        this.templateForm.controls['notifyTo'].controls['status'].setValue(id);
        this.templateForm.controls['notifyTo'].controls['userType'].setValue(this.userType);
        var audioObject = this.baseService.extractOptions(this.audio.nativeElement.selectedOptions)[0];
        this.templateForm.controls['audio_id'].setValue(audioObject.id);
        this.templateForm.controls['taxanomy'].setValue(this.baseService.removeCylicObj(this.taxanomy));
        this.templateForm.controls['selectedNodes'].setValue(this.selectedNodes);
        this.templateForm.controls['classes'].setValue(this.classes);
        this.templateForm.controls['users'].setValue(this.users);
        var arr:any[] = [];
        arr = this.treeService.getTreeJson(this.hash);

        this.templateForm.controls['notifiedCategories'].setValue(arr);

        if (this.templateForm._value.notifiedCategories.length === 0 && !this.templateForm._value.phoneNo) {
            this.baseService.showNotification('Message Not Sent', "Enter Recipient Details", 'bg-danger');
        } else if (!audioObject.id) {
            this.baseService.showNotification('Message Not Sent', "Choose Audio File", 'bg-danger');
        } else {
            dataFound = true;
        }

        if (this.templateForm._value.phoneNo === null) {
            this.templateForm.controls['phoneNo'].setValue('');
        }

        return dataFound;
    }

    saveNotificationCallBack(result:any, id:any, error:boolean) {
        var message = (id == "Sent" ? "Voice Message Sent" : "Voice Message Saved as Draft");
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(message, "", 'bg-success');
            this.baseService.closeOverlay('#scheduleVoice');
            this.baseService.dataTableReload('datatable-voice');
            this.getMediaCount();
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    resetForm() {
        this.baseService.removeHideClass('.Draft');
        this.baseService.removeHideClass('.Sent');
        this.createForm();
        this.scheduleDate = null;
        this.scheduleTime = null;
        this.show = 'now';
        this.notificationId = '';
        this.getAllCategories();
        this.classes = [];
        this.userType = [];
        this.enableData = true;
        this.baseService.enableSelectWithEmpty('#audios', this.audios, [ 'name', 'id' ], null);
    }

}
