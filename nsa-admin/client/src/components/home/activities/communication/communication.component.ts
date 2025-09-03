/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {Constants, ServiceUrls} from "../../../../common/index";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'communication.html'
})
export class CommunicationComponent implements OnInit {

    channelFeatures : any[];
    enable: boolean = false;
    constructor(private baseService: BaseService,
                private commonService: CommonService,public constants: Constants,
                private serviceUrls: ServiceUrls) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Communications')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.getAllChannelFeatures();
        this.channelFeatures= [];
        this.enable = this.baseService.havePermissionsToEdit(this.constants.SECTION_PERMISSIONS)
    }

    getAllChannelFeatures(){
        this.commonService.get(this.serviceUrls.ChannelFeatures).then(channelFeatures => this.callBack(channelFeatures))
    }

    requested_update(event:any, id:any){
        this.baseService.enableBtnLoading(id);

        this.commonService.put(this.serviceUrls.ChannelFeatures, event.target.value).then(
            result => this.saveChannelFeatureCallBack(result, id, false),
            error => this.saveChannelFeatureCallBack(<any>error, id, true))
    }

    saveChannelFeatureCallBack(result:any, id:any,error:boolean){
        var successMsg ="Channel Details Updated Successfully";
        if(error){
            this.baseService.showNotification(result,"", 'bg-danger');
            this.baseService.disableBtnLoading(id);
        }else{
            this.baseService.showNotification(result.message,successMsg, 'bg-success');
            this.baseService.disableBtnLoading(id);
            this.ngOnInit();
        }
    }

    callBack(channelFeatures: any) {
        if (channelFeatures != undefined) {
            this.channelFeatures = channelFeatures;
        } else {
            this.channelFeatures = [];
        }
    }
}
