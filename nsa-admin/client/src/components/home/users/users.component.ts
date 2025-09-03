/**
 * Created by senthilPeriyasamy on 12/28/2016.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Constants, Messages, ServiceUrls} from "../../../common/index";
import {BaseService} from "../../../services/index";
import {CommonService} from "../../../services/common/common.service";
@Component({
    templateUrl: 'users.html'
})
export class UsersComponent implements OnInit {
    oldStatus: string;
    status: any;
    templates: any[];
    template: any[];
    notification: any[];
    templateForm: any;
    charMinLength = this.constants.charMinLength;
    media: any;
    roleId: any;
    templateId: any;
    currentText: any;
    notificationId: any = '';
    count: any = 1;
    charsLeft: any = 900;
    prototypes = [ {id: 0, name: 'All'}, {id: 2, name: 'Employee'}, {id: 3, name: 'Parent'}, {id: '', name: 'Select Type'},];
    selectedTypes = [{templateId: '00000000-0000-0000-0000-000000000000', templateName: 'Select Template'}]

    constructor(private constants: Constants,
                private messages: Messages,
                private serviceUrls: ServiceUrls,
                private commonSerive: CommonService,
                private baseService : BaseService,
                public formBuilder: FormBuilder) {

    }

    createForm() {
        this.roleId= [this.prototypes[3].id];
        this.templateId = [this.selectedTypes[0].templateId, Validators.required];
        this.templateForm = this.formBuilder.group({
            'phoneNo': [''],
            'createdDate': [''],
            'notificationId': this.notificationId,
            notifyTo : this.formBuilder.group({
                'roleId': this.roleId,
                'status':['Sent'],
                'count':['1']
            }),
            notifyFrom : this.formBuilder.group({
                /*'userId' : ["111"]*/
            }),
            notify : this.formBuilder.group({
                sms: [true, Validators.required]
            }),
            sms :this.formBuilder.group({
                'templateId': this.templateId,
                'templateName': ['', Validators.required],
                'templateTitle': [''],
                'title': ['', Validators.required]
            })
        });
    }

    ngOnInit() {
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getAllUsersUrl);
        this.getAllUsers();
        this.template = [{template_message:''}];
        this.createForm();

    }

    getAllUsers() {
        this.commonSerive.get(this.serviceUrls.getAllUsersUrl)
            .then(templates => this.templates = templates);
    }

    /*getNotifcationLogsById(value: any) {
        this.baseService.openModal('#modal_theme_primary1');
        this.baseService.enableDataForDatatable(this.serviceUrls.getAllNotificationLogs + '/' + value);
    }*/
}

