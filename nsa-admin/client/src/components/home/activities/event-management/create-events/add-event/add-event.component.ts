/**
 * Created by Cyril  on 05-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService, TreeService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {FileUploader} from "ng2-file-upload";
import {CommonService} from "../../../../../../services/common/common.service";
declare var moment: any;
declare var jQuery: any;


@Component({
    selector: 'add-event',
    templateUrl: 'add-event.html'
})

export class AddEventComponent implements OnInit {

    eventForm: any;
    userType: any[] = [];
    classes: any[] = [];
    data: any[]= [];
    hash: any[];
    activityTypes: any[];
    eventTypes: any[];
    eventVenues: any[];
    students: any[] ;
    texts: string[];
    results: string[];
    date: any;
    country: any;
    countries: any[];
    attachments: any[] = [];
    attachmentsForm: any = {};
    selectedNodes: any[] = [];
    taxanomy: any[] = [];
    feature:any[];
    uploadId: any;
    datei = 0;
    users: any[];
    datey = 0;
    date1: Date = new Date(0,0,0, 9,0);
    date2: Date = new Date(0,0,0, 10,0);
    charsLeft: any = 160;

    @ViewChild('selectActivity') selectActivity: ElementRef
    @ViewChild('selectCategory') selectCategory: ElementRef
    @ViewChild('selectStudents') selectStudents: ElementRef
    @ViewChild('dueDate') dueDate: ElementRef
    @ViewChild('selectVenue') selectVenue: ElementRef
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef
    @ViewChild('pickerStartTime') pickerStartTime:ElementRef
    @ViewChild('pickerEndTime') pickerEndTime:ElementRef

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private treeService: TreeService,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    //public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload'});
    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', allowedMimeType: this.constants.allowFileTypes});

    ngOnInit() {
        this.createEventForm()
        this.getAllCategories();
        this.getActivityTypes();
        this.getEventTypes();
        this.getEventVenues();
        this.getFeatureChannelConfiguration();

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
    }

    createEventForm() {
        this.eventForm = this.fb.group({
            'eventName': ['', Validators.required],
            'eventTypeName': '',
            'eventTypeId': '',
            'eventActivityTypeId': '',
            'venue': [],
            'date': '',
            'endTime': '',
            'startTime': '',
            'classes': [],
            'students': [],
            'mapLocation': '',
            'desc': '',
            'isMandatory': true,
            "notify":  this.fb.group({
                "sms": '',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': 'Sent',
                'userType': ''
            })
        });
    }


    openOverlay(event:any) {
        this.datey = this.datey + 1;
        this.datei = this.datei + 1;
        if(event.target.value != 'Create Activity'){
            var selectedDate = JSON.parse(event.target.value);
            jQuery('.selectedDate').text(moment(selectedDate.start).format('ll') +' - '+ moment(selectedDate.start).format('ll'));
        }else {
            jQuery('.selectedDate').text(moment(new Date()).format('ll') +' - '+ moment(new Date()).format('ll'));
        }
        this.resetForm();
        //this.getAllStudents();
        this.getFeatureChannelConfiguration();
        this.baseService.openOverlay(event);
    }

    keyDown() {
        setTimeout(() => {
            this.changed()
        }, 50);
    }

    changed() {
        this.charsLeft = 160 - this.eventForm._value.desc.length;
    }

    closeOverlay(event:any) {
        this.classes = [];
        this.userType = [];
        this.baseService.closeOverlay('#addEvent');
        this.uploader.clearQueue();
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)

        )
    }

    callBackChannels(data: any) {
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    getEventTypes() {
        this.commonService.get(this.serviceUrls.eventType).then(
            data => this.callBackEventTypes(data)
        )
    }

    callBackEventTypes(data:any) {
        this.eventTypes = data;
        this.baseService.enableSelectWithEmpty('#event-category', this.eventTypes, this.constants.eventTypeObj, null);
    }

    getActivityTypes() {
        this.commonService.get(this.serviceUrls.activityType).then(
            data => this.callBackActivityTypes(data)
        )
    }

    callBackActivityTypes(data:any) {
        this.activityTypes = data;
        this.baseService.enableSelectWithEmpty('#activity-type', this.activityTypes, this.constants.activityTypeObj, null);
    }

    getEventVenues() {
        this.commonService.get(this.serviceUrls.eventVenue).then(
            data => this.callBackEventVenues(data)
        )
    }

    callBackEventVenues(data:any) {
        this.eventVenues = data;
        this.baseService.enableMultiSelectFilteringAll('.event-venue', data, this.constants.eventVenueObj, null);
    }

    getAllStudents() {
        this.commonService.get(this.serviceUrls.getAllStudents).then(
            data => this.callBackStudents(data)
        )
    }

    callBackStudents(data:any) {
        this.students = data;
        this.baseService.enableMultiStudent('.event-users', data, this.constants.studentObject, null);
    }


    getAllCategories() {
        this.commonService.get(this.serviceUrls.getAllCategoriesUrl).then(
            data => this.callBackData(data)
        )
    }

    callBackData(data:any) {
        this.data = data;
        this.taxanomy = data;
        this.hash = this.treeService.buildDataHierarchy(data);
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

        updateParent(toggleNode);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.users = this.treeService.updateEmpSelected(this.hash)
        this.classes = selected.classObject;
        this.userType = selected.userType;

    }

    myUpdate(data: any[]) {
        this.data = data;
        this.hash = this.treeService.buildDataUpdateHierarchy(this.data, data)
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        this.classes = selected.classObject;
        this.userType = selected.userType;
    }

    save(id: any) {
        var dataFound = this.setValidations();
        if(this.eventForm.valid && dataFound) {
            this.setFormValues();
            this.baseService.enableBtnLoading(id);
            this.baseService.enableLoadingWithMsg(this.constants.updating)
            this.commonService.post(this.serviceUrls.event, this.eventForm._value).then(
                result => this.saveEventCallBack(result, id, false),
                error => this.saveEventCallBack(<any>error, id, true))
        }
    }

    setFormValues() {
        var selectedUsers: any[] = [];
        var arr: any[] = [];
        arr = this.treeService.getTreeJson(this.hash);
        this.eventForm._value.notifiedCategories = arr;
        this.eventForm._value.notify.sms = this.sms.nativeElement.checked;
        this.eventForm._value.notify.push = this.push.nativeElement.checked;
        var date = this.dueDate.nativeElement.innerText.split('   -   ');
        var date1 = date[0] + '-' + date[1];
        this.eventForm._value.date = date1;
        var startTime = this.pickerStartTime.nativeElement.children[0].children[0].children[1].children[0].value;
        var endTime = this.pickerEndTime.nativeElement.children[0].children[0].children[1].children[0].value;
        this.eventForm._value.startTime = moment(startTime, "h:mm A").format("HH:mm");
        this.eventForm._value.endTime = moment(endTime, "h:mm A").format("HH:mm");
        this.eventForm._value.classes = this.classes;
        this.eventForm._value.users = this.users;
        this.eventForm._value.notifyTo.userType = this.userType;
        this.eventForm._value.taxanomy = this.baseService.removeCylicObj(this.taxanomy);
        this.eventForm._value.selectedNodes = this.selectedNodes;
        this.eventForm._value.venue = this.baseService.extractOptions(this.selectVenue.nativeElement.selectedOptions);
        this.eventForm._value.eventTypeName = this.baseService.extractOptions(this.selectCategory.nativeElement.selectedOptions)[0].name;
        this.eventForm._value.eventTypeId = this.baseService.extractOptions(this.selectCategory.nativeElement.selectedOptions)[0].id;
        this.eventForm._value.activityTypeId = this.baseService.extractOptions(this.selectActivity.nativeElement.selectedOptions)[0].id;
        this.eventForm._value.activityTypeName = this.baseService.extractOptions(this.selectActivity.nativeElement.selectedOptions)[0].name;
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


    saveEventCallBack(result: any, id: any, error: boolean){
        this.uploadId = result.event_id;
        this.uploader.onCompleteAll = () => {
            this.attachmentsForm['eventId'] = result.event_id;
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
        this.baseService.disableBtnLoading(id)
        setTimeout(() => {
            this.baseService.disableLoading();
        }, 500);
    }

    addAttachements(data: any, id: any) {
        this.commonService.put(this.serviceUrls.eventAttachments + data.eventId, data).then(
            result => this.addAttachementsCallback(result, id, false),
            error => this.addAttachementsCallback(<any>error, id, true))
    }

    addAttachementsCallback(result: any, id:any , err: any) {
        this.attachments.pop();
        this.baseService.showNotification(result.message, "", 'bg-success');
        this.baseService.closeOverlay('#addEvent');
        jQuery('#reRenderData').click();
        this.uploader.clearQueue();
        this.resetForm();
        this.classes = [];
        this.uploader.clearQueue();
        this.attachments = []
        this.baseService.disableBtnLoading(id);
    }

    resetForm() {
        this.userType = [];
        this.baseService.clearText('.ui-inputtext');
        this.createEventForm();
        this.getAllCategories();
        this.baseService.enableSelectWithEmpty('#event-category', this.eventTypes, this.constants.eventTypeObj, null);
        this.baseService.enableMultiSelectFilteringAll('.event-venue', this.eventVenues, this.constants.eventVenueObj, null);
        this.baseService.enableSelectWithEmpty('#activity-type', this.activityTypes, this.constants.activityTypeObj, null);
        /*this.baseService.enableMultiStudent('.event-users', this.students, this.constants.studentObject, null);*/
    }

    search(event: any) {
        this.commonService.get(this.serviceUrls.searchStudent + event.query).then(
            texts => this.results = texts
        )
    }

    setValidations() : any {
        var dataFound = false;
        var form = this.eventForm._value;
        var startTime = this.pickerStartTime.nativeElement.children[0].children[0].children[1].children[0].value;
        var endTime = this.pickerEndTime.nativeElement.children[0].children[0].children[1].children[0].value;
        this.eventForm._value.startTime = moment(startTime, "h:mm A").format("HH:mm");
        this.eventForm._value.endTime = moment(endTime, "h:mm A").format("HH:mm");
        form.date = this.dueDate.nativeElement.innerText;
        form.venue = this.baseService.extractOptions(this.selectVenue.nativeElement.selectedOptions);
        form.eventTypeName = this.baseService.extractOptions(this.selectCategory.nativeElement.selectedOptions)[0].name;
        this.eventForm._value.activityTypeId = this.baseService.extractOptions(this.selectActivity.nativeElement.selectedOptions)[0].id;
        var students = form.students ?  form.students : [];
        if (this.eventForm._value.date.length < 1) {
            this.baseService.showNotification("Enter Date", "", 'bg-danger');
        } else if (this.eventForm._value.startTime == "Invalid date") {
            this.baseService.showNotification("Enter Start Time", "", 'bg-danger');
        } else if(this.eventForm._value.endTime == "Invalid date"){
            this.baseService.showNotification("Enter End Time", "", 'bg-danger');
        } else if(this.eventForm._value.startTime == this.eventForm._value.endTime){
           this.baseService.showNotification("Enter Different Time", "",'bg-danger');
        } else if(!this.eventForm._value.activityTypeId){
            this.baseService.showNotification("Please select ActivityType", "", 'bg-danger');
        } else if (this.eventForm._value.venue.length < 1) {
            this.baseService.showNotification("Enter Venue Details", "", 'bg-danger');
        } else if((this.classes.length < 1 && this.userType.length < 1) && students.length <1) {
            this.baseService.showNotification("Enter Class or Student Details", "", 'bg-danger');
        } else {
            dataFound = true;
        }
        return dataFound;
    }
}