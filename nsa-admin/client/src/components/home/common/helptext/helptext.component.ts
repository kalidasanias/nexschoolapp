/**
 * Created by senthil-p on 17/05/17.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls} from "../../../../common/constants/service.urls";
import {ActivatedRoute} from "@angular/router";
declare var jQuery: any;
@Component({
    selector: 'help-text',
    templateUrl: 'helptext.html'
})
export class HelpTextComponent implements OnInit{
    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private route: ActivatedRoute,
                private serviceUrls: ServiceUrls) {
    }

    feature:any = {};

    ngOnInit() {
        // this.showPopup();
    }

    callBack(feature:any){
        this.feature = feature;
        if (feature != undefined) {
            var message = this.feature.help_text
            var title = this.feature.feature_name
            jQuery('#helptext').popover({
                trigger: 'hover',
                placement: 'left',
                toggle : 'popover',
                title: title,
                content: 'loading....',
                template: '<div class="popover border-info"><div class="arrow"></div><h3 class="popover-title nsa-bg-primary"></h3><div class="popover-content"></div></div>'
            });
            jQuery('#helptext').attr('data-content', message).data('bs.popover').setContent()
            jQuery('#helptext').attr('data-original-title', title)
        }
    }
    showPopup() {
        this.route.queryParams.subscribe(params => {
           if(params['fi']) {
               this.gethelpText();
           }
        });

    }

    gethelpText() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(feature => this.callBack(feature))
    }

}