/**
 * Created by senthil on 28/07/17.
 */
import {Component, OnInit, Input} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {CommonService} from "../../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";

@Component({
    selector: 'album-details',
    templateUrl: 'album-details.html'
})
export class AlbumDetailsComponent implements OnInit {
    private albumDetailObjs: any = []
    @Input() type: any
    showWarning: boolean;
    baseUrl: any

    @Input()
    set albumDetails(albumDetails: any) {
        this.albumDetailObjs = albumDetails;
        this.showWarning = albumDetails !== undefined && albumDetails.length > 0 ? false : true
    }

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseUrl = this.baseService.getBaseUrl();
    }

}
