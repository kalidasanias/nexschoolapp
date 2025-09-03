/**
 * Created by senthil on 1/25/2017.
 */
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FileUploadModule} from "ng2-file-upload";


import { ControlMessagesComponent } from '../app/control-messages.component';
import {OverlayComponent} from "../overlay/overlay.component";
import {AddGradingSystemComponent} from "../home/school-management/exam-report/exam-configuration/grading-system/add-grading/add-grading.component";
import {ExtCalendarComponent} from "../home/common/calendar/ext.calendar.component";
import {ModalComponent} from "../home/modal/modal";
import {WizardComponent} from "../wizard/wizard.component";
import {WizardStepComponent} from "../wizard/wizard-step.component";
import {AttachmentComponent} from "../home/common/attachment/attachment.component";
import {HelpTextComponent} from "../home/common/helptext/helptext.component";
import {AngularDualListBoxModule} from "../dual-list/angular-dual-listbox.module";
import {FailureComponent} from "../home/confirmation/failure/failure.component";
import {CommonService} from "../../services/common/common.service";
import {NotificationLogsComponent} from "../home/notification/notification-logs/notification-logs.component";
import {ReceiptComponent} from "../home/fee-management/pay/receipt/receipt.component";
import {TransactionDetailsComponent} from "../home/fee-management/pay/transaction-details/transaction-details.component";

@NgModule({
    imports:      [ CommonModule, AngularDualListBoxModule ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    providers: [CommonService],
    declarations: [ ReceiptComponent, TransactionDetailsComponent, NotificationLogsComponent, ControlMessagesComponent, HelpTextComponent, AttachmentComponent, OverlayComponent, ExtCalendarComponent, ModalComponent, WizardComponent, WizardStepComponent, FailureComponent ],
    exports:      [ ReceiptComponent, TransactionDetailsComponent, NotificationLogsComponent, CommonModule, FormsModule, HelpTextComponent, ReactiveFormsModule, AttachmentComponent, ControlMessagesComponent, OverlayComponent, ExtCalendarComponent, ModalComponent, FileUploadModule, WizardComponent, WizardStepComponent, AngularDualListBoxModule, FailureComponent ]
})
export class AppSharedModule { }