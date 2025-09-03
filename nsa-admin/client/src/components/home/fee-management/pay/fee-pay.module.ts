/**
 * Created by senthil on 2/16/2017.
 */
import {NgModule} from "@angular/core";
import {AppSharedModule} from "../../../shared/shared.module";
import {FeePayRoutingModule} from "./fee-pay.routing.module";

import {FeePayComponent} from "./fee-pay.component";
import {InvoiceComponent} from "./invoice/invoice.component";
import {PaymentModule} from "./payment/payment.module";
@NgModule({

    imports: [
        AppSharedModule,
        FeePayRoutingModule,
        PaymentModule
    ],
    exports: [],
    declarations: [FeePayComponent, InvoiceComponent],
})
export class FeePayModule { }