import { NgModule } from '@angular/core';

import { DualListComponent } from './dual-list.component';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
	imports:      [
		CommonModule,
		FormsModule
	],
	declarations: [ DualListComponent ],
	exports:      [ DualListComponent ]
})
export class AngularDualListBoxModule {}

