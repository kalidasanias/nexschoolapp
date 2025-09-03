/**
 * Created by maggi on 24/05/17.
 */
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {WrittenExamComponent} from "../../progress-card-config/written-exam/written-exam.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: WrittenExamComponent}
        ])
    ],
    exports: [RouterModule],
})
export class MarkUploadRoutingModule{ }