/**
 * Created by senthil on 2/16/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { AppSharedModule } from '../../../../shared/shared.module'
import {PaymentComponent} from "./payment.component";
@NgModule({

    imports: [
        AppSharedModule,
    ],
    exports: [PaymentComponent],
    declarations: [PaymentComponent],
    providers: [],
})
export class PaymentModule { }