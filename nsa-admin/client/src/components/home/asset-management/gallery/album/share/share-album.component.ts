/**
 * Created by senthil on 26/07/17.
 */
import {Component, OnInit, Input} from "@angular/core";
import {BaseService} from "../../../../../../services/index";
import {CommonService} from "../../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
import {FormBuilder, Validators} from "@angular/forms";
import {TreeService} from "../../../../../../services/tree/tree.service";

@Component({
    selector: 'share-album',
    templateUrl: 'share-album.html'
})
export class AlbumShareComponent implements OnInit {
    shareAlbumForm: any
    object: any = {}
    enabled: any
    feature: any
    data:any[] = [];
    hash : any [] = [];
    classes: any[] = [];
    userType: any[] = [];
    taxanomy: any[]= [];
    selectedNodes:any[] = [];
    users: any[]
    showTaxanomy: boolean = true


    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private fb: FormBuilder,
                private treeService: TreeService,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.createForm();
        this.getAllCategories();
        this.getFeatureChannelConfiguration();
    }

    openOverlay(event: any) {
        this.baseService.openOverlay(event)
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#albumShare')
    }

    openShareAlbum(event: any, obj: any) {
        this.object = obj
        console.log(this.object)
        this.openOverlay(event);
    }

    createForm() {
        this.shareAlbumForm =  this.fb.group({
            'albumName': ['']
        })
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature = data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    getAllCategories() {
        this.commonService.get(this.serviceUrls.getAllCategoriesUrl).then(
            data => this.callBackData(data)
        )
    }

    callBackData(data:any) {
        this.data = data;
        this.taxanomy = data;
        this.hash = this.buildDataHierarchy(data);
    }

    getTaxanomy(event: any) {
        var val = event.target.value;
        if(val == 'Employee') {
            this.showTaxanomy = false
        } else {
            this.showTaxanomy = true
        }
    }

    buildDataHierarchy(data:any[]):any {
        let id = 1;
        let hash = {};
        let setNodeID = (node:any, parentId:number) => {
            hash[id] = node;
            node['selected'] = false;
            node['nodeId'] = id;
            node['parentNodeId'] = parentId;
            if (node.children.length) {
                const parentId = id;
                node.children.forEach(function (node:any) {
                    id++;
                    setNodeID(node, parentId);
                });
            }
            id++;
        }
        data.forEach(function (node:any) {
            node['expanded'] = true;
            setNodeID(node, 0);
        });
        return hash;
    }

    nodeSelected(toggleNode:any) {
        // select / unselect all children (recursive)
        let toggleChildren = (node:any) => {
            node.children.forEach(function (child:any) {
                node['expanded'] = true;
                child.selected = node.selected;
                if (child.children.length) {
                    toggleChildren(child);
                }
            });
        }
        toggleChildren(toggleNode);

        //update parent if needed (recursive)
        let updateParent = (node:any) => {
            if (node.parentNodeId != 0) {
                const parentNode = this.hash[node.parentNodeId];
                const siblings = parentNode.children;
                parentNode.partialSelection = false;
                let equalSiblings = true;
                siblings.forEach(function (sibling:any) {
                    if (sibling.selected !== node.selected) {
                        equalSiblings = false;
                    }
                });
                if (equalSiblings) {
                    parentNode.selected = node.selected;
                    if (parentNode.parentNodeId != 0) {
                        updateParent(parentNode);
                    }
                } else {
                    parentNode.partialSelection = true;
                }
            }
        }
        updateParent(toggleNode);
        this.selectedNodes = this.treeService.getSelectedNodes(this.hash);
        var selected = this.treeService.updateSelected(this.classes, this.userType, this.hash);
        this.users = this.treeService.updateEmpSelected(this.hash)
        this.classes = selected.classObject;
        this.userType = selected.userType;
    }

}
