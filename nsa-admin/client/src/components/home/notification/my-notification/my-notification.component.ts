/**
 * Created by Deepak on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls} from "../../../../common/index";
import {AttachmentComponent} from "../../common/attachment/attachment.component";

@Component({
    selector: 'my-notification',
    templateUrl: 'my-notification.html'
})
export class MyNotificationComponent implements OnInit {


    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls) {

    }
    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;

    ngOnInit() {
        var user = this.baseService.findUser();
        this.baseService.enableDataTableAjax(this.serviceUrls.getUserNotification + user.user_name , null)
    }

    downloadNotes(event: any) {
        var value = JSON.parse(event.target.value);
        this.attachmentComponent.openModalByCls('myNotification', value, false)
    }

}
