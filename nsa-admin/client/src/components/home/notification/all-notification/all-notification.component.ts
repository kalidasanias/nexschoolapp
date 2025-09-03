/**
 * Created by senthilPeriyasamy on 12/28/2016.
 */
import {Component, DoCheck, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {BaseService, TreeService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {AttachmentComponent} from "../../common/attachment/attachment.component";
import {DateService} from "../../../../services/common/date.service";
import {FileUploader} from "ng2-file-upload";
declare var _ : any;

@Component({
    selector: 'all-notification',
    templateUrl: 'all-notification.html'
})
export class AllNotificationComponent implements OnInit {
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef
    @ViewChild('date') date: ElementRef;
    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;

    data:any[] = [];
    hash : any [] = [];
    notified: any[] = [];
    classObject: any[] = [];
    objId: any;
    attachments: any[] = [];
    existingAttachments: any[] = [];
    classes: any[] = [];
    userType: any[] = [];
    selectedNodes:any[] = [];
    enableData: boolean = false;
    oldStatus:string;
    status:any;
    templates:any[];
    template:any[];
    notification:any[];
    notifyObj: any;
    templateForm:any;
    charMinLength = this.constants.charMinLength;
    media:any;
    roleId:any;
    deleteObj: boolean = true;
    templateId:any;
    currentText:any;
    notificationId:any = '';
    count:any = 1;
    charsLeft:any = 900;
    taxanomy: any[]= [];
    enable: boolean = false;
    selectedTypes = [{templateId: '00000000-0000-0000-0000-000000000000', templateName: 'Select Template'}];
    feature:any[];
    users: any[];
    startDate: any;
    endDate: any;
    dates: any;
    isDuration: boolean = false;
    results: string[];
    attachmentsForm: any = {};

    public uploader:FileUploader = new FileUploader({url: this.serviceUrls.serviceBaseUrl + 'upload', maxFileSize:10*1024*1024, allowedMimeType: this.constants.allowFileTypes});

    constructor(private constants: Constants,
                private messages: Messages,
                private serviceUrls: ServiceUrls,
                private treeService: TreeService,
                private baseService: BaseService,
                private dateService: DateService,
                private formBuilder: FormBuilder,
                private commonService: CommonService) {
    }

    createForm() {
        this.templateId = this.selectedTypes[0].templateId;
        this.templateForm = this.formBuilder.group({
            'phoneNo': [],
            'students': [],
            'notifiedCategories': [],
            'createdDate': [],
            'notificationId': this.notificationId,
            notifyTo: this.formBuilder.group({
                'userType': [],
                'status': ['Sent'],
                'count': ['1']
            }),
            notifyFrom: this.formBuilder.group({
                /*'userId' : ["111"]*/
            }),
            notify: this.formBuilder.group({
                "sms":false,
                "email": false,
                "push": false

            }),
            smsTemplate: this.formBuilder.group({
                'templateId': this.templateId,
                'templateName': ['', Validators.required],
                'templateTitle': [''],
                'title': ['', Validators.required]
            }),
            pushTemplate: this.formBuilder.group({
                'templateId': this.templateId,
                'templateName': [''],
                'templateTitle': [''],
                'title': ['']
            }),
            emailTemplate: this.formBuilder.group({
                'templateId': this.templateId,
                'templateName': [''],
                'templateTitle': [''],
                'title': ['']
            }),

            'classes': [''],
                'attachments': ['']
        });
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Notifications');
        // this.baseService.enableDataTable(this.serviceUrls.getAllNotifications);
        this.today(null);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.NOTIFICATION_PERMISSIONS)
        this.getMediaCount();
        this.getAlltemplates();
        this.template = [{template_message: ''}];
        this.createForm();
        this.notifyObj = "";
        this.getAllCategories();
        this.getFeatureChannelConfiguration();
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();

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
    }

    keyDown() {
        setTimeout(() => {
            this.changed()
        }, 50);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#modal_theme_primary');
        this.resetForm()
    }

    openOverlay(event: any) {
        this.callbackTemplates(this.templates)
        this.resetForm();
        this.commonService.getActiveFeatureChannelDetails(this.feature)
        this.baseService.openOverlay(event);
        this.sms.nativeElement.checked=true;
        this.push.nativeElement.checked=true;
    }


    requested_delete(event:any) {
        var value = event.target.value;
        if(value){
            this.commonService.deleteMethodWithCallback(this.serviceUrls.deleteDraftNotificationUrl + JSON.parse(value).notification_id, value).then(
                result => this.deleteCallback(result, false),
                error => this.deleteCallback(<any>error, true));
        }
    }

    deleteCallback(result:any, error:boolean) {
        if (error) {
            var err: any = this.baseService.handleErr(result);
            this.baseService.showInformation('top', result, this.constants.n_info)
        } else {
            this.baseService.showInformation('top', this.messages.delete_success, this.constants.n_success);
            this.reload();
        }
    }

    getExistingFiles(event: any){
        this.existingAttachments = JSON.parse(event.target.value);
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    reload() {
        this.baseService.enableDivLoading('.datatable-nested', this.constants.updating);
        var thisObj = this;
        setTimeout(function () {
            thisObj.baseService.dataTableReload('datatable-nested');
            thisObj.baseService.disableDivLoading('.datatable-nested');
        }, 1000)
    }

    getAlltemplates() {
        this.commonService.get(this.serviceUrls.getAllTemplatesUrl)
            .then(template => this.callbackTemplates(template));
    }

    callbackTemplates(templates: any) {
        this.templates = templates
        this.baseService.enableSelectWithEmpty('#bootstrap-class', templates, this.constants.templateObjs, this.templateId);
    }

    getMediaCount() {
        this.commonService.get(this.serviceUrls.getMediaCountUrl)
            .then(media => this.media = media);
    }

    getTemplateById(value: any) {
        this.templateId = value
        this.template = [];
        if (value == this.constants.defaultUuid || value == null || value == '') {
            this.template = [{template_message: ''}];
        } else {
            this.commonService.get(this.serviceUrls.getTemplateByID + '/' + value)
                .then(template => this.callbackTemplate(template));
        }
    }

    callbackTemplate(template: any) {
        this.template = template
        this.keyDown();
    }


    saveNotification(id:any) {
        this.setFormValues();
        if (this.templateForm.valid) {
            this.templateForm._value.students = !_.isEmpty(this.templateForm._value.students) ? this.templateForm._value.students : null;
            if ((this.templateForm._value.classes.length == [ ] && this.templateForm._value.notifyTo.userType.length == [  ]) && !this.templateForm._value.phoneNo && this.templateForm._value.students == null ) {
                this.baseService.showNotification('Message Not Sent', "Enter Recipient Details", 'bg-danger');

            } else if (!this.templateForm._value.notify.sms && !this.templateForm._value.notify.push) {
                this.baseService.showNotification('Message Not Sent', "Please Select Notification Channel", 'bg-danger');

            } else if (this.notificationId != '' && this.oldStatus != 'Sent') {
                this.templateForm._value.notifyTo.status = id;
                this.baseService.enableBtnLoading(id);
                this.templateForm._value.notifyTo.sendMedia = true;
                if(this.uploader.queue.length > 0) {
                    this.templateForm._value.notifyTo.sendMedia = false;
                }

                this.commonService.put(this.serviceUrls.updateNotification + '/' + this.notificationId,this.templateForm._value).then(
                    result => this.saveNotificationCallBack(result, id, false),
                    error => this.saveNotificationCallBack(<any>error, id, true))


            } else {
                this.templateForm._value.notifyTo.status = id;
                this.baseService.enableBtnLoading(id);
                var url = id == "Sent" ? this.serviceUrls.saveTemplate : this.serviceUrls.saveDaftTemplate;
                if(this.uploader.queue.length > 0) {
                    url = id == "Sent" ? this.serviceUrls.saveSentTemplate : this.serviceUrls.saveDaftTemplate;
                }
                this.commonService.post(url, this.templateForm._value).then(
                    result => this.saveNotificationCallBack(result, id, false),
                    error => this.saveNotificationCallBack(<any>error, id, true))
            }
        }
    }


    addAttachements(data: any, objId: any, id: any) {
        this.commonService.put(this.serviceUrls.addNotificationAttachments + objId, data).then(
            result => this.addAttachementsCallback(result, id, false),
            error => this.addAttachementsCallback(<any>error, id, true))
    }

    addAttachementsCallback(result: any, id:any , err: any) {
        this.attachments.pop();
        if (err) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#modal_theme_primary');
            this.reload();
            this.baseService.dataTableReload('datatable-my-notifications');
            this.getMediaCount();
            this.resetForm();
            this.uploader.clearQueue();
        }
        this.baseService.disableBtnLoading(id);
    }

    saveNotificationCallBack(result:any, id:any, error:boolean) {
        this.objId = result.data != undefined ? result.data.notification_id : "";
        if(this.uploader.getNotUploadedItems().length) {
            this.uploader.uploadAll();
        } else {
            this.addAttachementsCallback(result, id, error)
        }
        this.uploader.onCompleteAll = () => {
            this.attachmentsForm = this.templateForm._value
            this.attachmentsForm['attachments'] = this.attachments;
            this.addAttachements(this.attachmentsForm, this.objId, id)
        }
    }

    sendSms(id: any ,notifyObj: any) {
        this.commonService.put(this.serviceUrls.getNotificationById + '/send/' + id, notifyObj).then(
            result => this.addAttachementsCallback(result, '', false),
            error => this.addAttachementsCallback(<any>error, '', true))
    }

    viewAttachment() {
        this.commonService.get(this.serviceUrls.getNotificationById + '/' + this.notifyObj.notification_id).then(
            notification => this.callBackAttachment(notification)
        );
    }

    callBackAttachment(value: any){
        this.notifyObj = value[0];
        if(this.notifyObj.status == 'Sent') {
            this.deleteObj = false;
            this.notifyObj.attachments = this.existingAttachments;
        }
        this.notifyObj['url'] = this.serviceUrls.deleteNotifyAttachement;
        this.notifyObj.id = this.notifyObj.notification_id;
        this.attachmentComponent.openModal(this.notifyObj, this.deleteObj)
    }

    resetForm() {
        this.baseService.removeHideClass('.Draft');
        this.baseService.removeHideClass('.Sent');
        this.baseService.clearText('.ui-inputtext');
        this.createForm();
        this.notificationId = '';
        this.getAllCategories();
        this.existingAttachments = [];
        this.attachments = [];
        this.classes = [];
        this.userType = [];
        this.enableData = true;
        this.selectedNodes = [];
        this.templateId = '';
        this.currentText = '';
        this.count = '';
        this.notifyObj = "";
        this.deleteObj = true;
        this.uploader.clearQueue();
        this.users = [];
        this.changed();
    }

    changed() {
        this.count = 1;
        this.currentText = this.templateForm._value.smsTemplate.templateName.length;
        this.charsLeft = 900 - this.currentText;
        this.count = this.currentText / this.charMinLength > 0 ? Math.ceil(this.currentText / this.charMinLength) : 1;
        this.templateForm._value.notifyTo.count = this.count;
    }

    getNotificationById(event:any, overlay: any) {
        var value = JSON.parse(event.target.value);
        var cyear = (localStorage.getItem(this.constants.cyear) == 'true');
        this.enableData = value.editPermissions && cyear;
        if(this.enableData) {
            this.baseService.removeHideClass('.Draft');
            this.baseService.removeHideClass('.Sent');
        } else {
            this.baseService.addHideClass('.Draft');
            this.baseService.addHideClass('.Sent');
        }
        this.commonService.get(this.serviceUrls.getNotificationById + '/' + value.notification_id)
            .then(notification => this.callBackNotification(event, notification, overlay))
    }


    callBackNotification(event: any, res:any, overlay:any) {
        var sms = _.find(res[0].media_name, function(o: any) { return o == "sms";  }) != undefined ? true : false;
        var push = _.find(res[0].media_name, function(o: any) { return o == "push"; }) != undefined ? true : false;
        var cYear = (localStorage.getItem(this.constants.cyear) == 'true');
        if(cYear){
            if(sms && !push){
                this.sms.nativeElement.checked=true;
                this.push.nativeElement.checked=false;
            }else if(!sms && push){
                this.sms.nativeElement.checked=false;
                this.push.nativeElement.checked=true;
            }else{
                this.sms.nativeElement.checked=true;
                this.push.nativeElement.checked=true;
            }
        }
        this.notification = res;
        this.notifyObj = res[0];
        this.templateId = res[0].template_id;
        var notifiedStudents = _.filter(JSON.parse(res[0].notified_students), function(o : any){ if(o.suggestStudent){ return o;}});
         this.existingAttachments = res[0].attachments;
        this.templateForm = this.formBuilder.group({
            'students': notifiedStudents ? [notifiedStudents] : [],
            'phoneNo': res[0].notified_mobile_numbers != null ? res[0].notified_mobile_numbers.toString() : [],
            'createdDate': res[0].created_date,
            'notificationId': [res[0].notification_id],
            notifyTo: this.formBuilder.group({
                'userType': '',
                'status': ['Sent'],
                'count': ['1']
            }),
            notifyFrom: this.formBuilder.group({
                /*'userId' : ["111"]*/
            }),
            notify: this.formBuilder.group({
                sms: [true, Validators.required]
            }),
            smsTemplate: this.formBuilder.group({
                'templateId': res[0].template_id,
                'templateName': [res[0].message],
                'templateTitle': [res[0].template_title],
                'title': [res[0].title]
            }),
            'classes': [''],
            attachments : [res[0].attachments]
        });
        this.keyDown()

        var updateData = res[0].notified_categories == null ? this.taxanomy : JSON.parse(res[0].notified_categories);
        this.myUpdate(updateData);
        this.oldStatus = res[0].status;
        this.callbackTemplates(this.templates)
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        if(overlay == 'true') {
            this.baseService.openOverlay(event);
        } else {
            this.sendSms(res[0].notification_id, this.templateForm._value);
        }

    }

    //Tree View
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
        this.users = this.treeService.updateEmpSelected(this.hash)
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

    myUpdate(data: any[]) {
        this.data = data;
        this.hash = this.treeService.buildDataUpdateHierarchy(this.data, data);
        this.users = this.treeService.updateEmpSelected(this.hash)
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.classes = selected.classObject;
        this.userType = selected.userType;
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature =data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    setFormValues() {
        this.templateForm._value.smsTemplate.templateId = this.templateId
        this.status = this.templateForm._value.notifyTo.status;
        this.templateForm._value.classes = this.classes;
        this.templateForm._value.notifyTo.userType = this.userType;
        this.notificationId = this.templateForm._value.notificationId;
        this.templateForm._value.notify.sms = this.sms.nativeElement.checked;
        this.templateForm._value.notify.email = this.email.nativeElement.checked;
        this.templateForm._value.notify.push = this.push.nativeElement.checked;
        this.templateForm._value.pushTemplate = this.templateForm._value.smsTemplate;
        this.templateForm._value.emailTemplate = this.templateForm._value.smsTemplate;
        this.templateForm._value.taxanomy = this.baseService.removeCylicObj(this.taxanomy);
        this.templateForm._value.selectedNodes = this.selectedNodes;
        this.templateForm._value.users = this.users;
        this.templateForm._value.attachments = this.existingAttachments;
        var arr:any[] = [];
        arr = this.treeService.getTreeJson(this.hash);
        this.templateForm._value['notifiedCategories'] = arr;
    }

    today(event: any) {
        this.isDuration = false
        var date = this.dateService.getToday();
        this.setDate(date)
    }

    week(event: any) {
        this.isDuration = false
        var date = this.dateService.getCurrentWeek();
        this.setDate(date)
    }

    month(event: any) {
        this.isDuration = false
        var date = this.dateService.getCurrentMonth();
        this.setDate(date)
    }

    setDate(date: any) {
        this.startDate = date[0]
        this.endDate = date[1]
        this.getFilteredNotifications();
    }

    getFilteredNotifications() {
        this.baseService.destroyDatatable('.datatable-nested');
        this.baseService.enableDataTable(this.serviceUrls.getAllNotifications + '?startDate=' + this.startDate + '&endDate=' + this.endDate);
    }

    duration(event: any) {
        this.isDuration = true
    }

    getDataByDuration(event: any) {
        this.dates = this.date.nativeElement.innerText;
        var split = this.dates.split('-');
        this.startDate = this.dateService.getStartTime(split[0].trim())
        this.endDate = this.dateService.getEndTime(split[1].trim())
        this.getFilteredNotifications();
    }

    search(event: any) {
        this.commonService.get(this.serviceUrls.searchStudent + event.query).then(
            texts => this.results = texts
        )
    }

}
