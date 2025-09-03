/**
 * Created by Cyril on 05-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {AttachmentComponent} from "../../../../common/attachment/attachment.component";
declare var jQuery : any

@Component({
    selector: 'view-assignment',
    templateUrl: 'view-assignment.html'
})

export class ViewAssignmentComponent implements OnInit {

    @ViewChild('single') single: ElementRef
    @ViewChild('singleSubject') singleSubject: ElementRef
    @ViewChild('selectFilter') selectFilter: ElementRef
    @ViewChild('dueDate') dueDate: ElementRef
    @ViewChild('radio') radio: ElementRef

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
    assignmentsDetails:any;
    deleteObj: boolean = true;
    attachmentComponent: any;

    constructor(private baseService: BaseService,
                private constants: Constants,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.assignment = "";
        this.assignmentsDetails = ""
    }

    openOverlay(event:any) {
        this.assignment = "";
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#viewAssignment');
    }

    getAssignmentDetailById(event: any, attachCompnent: any){
        this.attachmentComponent = attachCompnent;
        this.assignmentsDetails = JSON.parse(event.target.value);
        jQuery('#assignmentName').val(this.assignmentsDetails.assignmentName);
        jQuery('#Description').val(this.assignmentsDetails.assignmentDesc);
        this.modalId = event;
        this.baseService.dataTableDestroy('datatable-assignment-view');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getAssignmentDetailById + this.assignmentsDetails.id);
        this.baseService.openOverlay(this.modalId);
    }

    viewAttachment() {
        this.assignmentsDetails['url'] = this.serviceUrls.deleteAssignmentAttachement;
        this.assignmentsDetails['scheduleobject'] = true;
        this.attachmentComponent.openModal(this.assignmentsDetails, this.deleteObj);
    }

}