/**
 * Created by senthil on 28/07/17.
 */
import {Component, OnInit, Input} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../common/constants/service.urls";

@Component({
    selector: 'image-details',
    templateUrl: 'image-details.html'
})
export class ImageDetailsComponent implements OnInit {
    private images: any = []
    showWarning: boolean;
    baseUrl: any

    @Input()
    set schoolDetails(images: any) {
        this.images = images;
        this.showWarning = images !== undefined && images.length > 0 ? false : true
    }

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseUrl = this.baseService.getBaseUrl();
    }

}
