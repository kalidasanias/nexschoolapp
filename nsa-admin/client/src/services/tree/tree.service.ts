/**
 * Created by Sai Deepak on 13-Feb-17.
 */

import { Injectable }     from '@angular/core';
declare var _: any

@Injectable()
export class  TreeService {
    selectedNodes: any[];
    hash: any[];
    nonDisabledNodes: any[] = []
    defaultDisabledNodes: any[] = ["331dc52c-b36d-4c1b-a5ad-e2e402bfe485"]

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

    updateSelected(classObject: any[], userType: any[], hash: any[]) {
        classObject = [];
        userType = [];
        for (let node in hash) {
            if (hash[node].partialSelection) {
                let currentNode = hash[node];
                this.selectedNodes = [];
                var selectedSectionNodes = [];
                if (currentNode.parentNodeId == 0) {
                    for (let child in currentNode.children){
                        this.selectedNodes = [];
                        let currentNode1 = currentNode.children[child];
                        var selctedChildNodes = currentNode1.children;
                        if(currentNode1.selected || currentNode1.partialSelection ){
                            for (let child in currentNode1.children) {
                                let child1 = currentNode1.children[child];
                                if(child1.selected){
                                    selectedSectionNodes.push({id: child1['id'], name: child1['label']});
                                    this.selectedNodes.push(child1['id']);
                                }
                            }
                            if(selctedChildNodes.length > 0) {
                                if(this.selectedNodes.length > 0) {
                                    classObject.push({"id" : "" + currentNode1['id'] + "", "name": ""+ currentNode1['label'] + "", "section":  this.selectedNodes, "sectionNode":selectedSectionNodes});
                                }
                            } else {
                                classObject.push({"id" : "" + currentNode1['id'] + "", "name": ""+ currentNode1['label'] + "", "section":  this.selectedNodes, "sectionNode":selectedSectionNodes});
                            }

                        }
                    }
                } else {
                    this.selectedNodes = [];
                    selectedSectionNodes = [];
                    for (let child in currentNode.children){
                        let currentNode1 = currentNode.children[child];
                        if(currentNode1.selected){
                            selectedSectionNodes.push({id: currentNode1['id'], name: currentNode1['label']});
                            this.selectedNodes.push(currentNode1['id']);
                        }
                    }
                    var fileterObject = _.filter(classObject, { 'id': currentNode['id']});
                    if(fileterObject.length <= 0 && this.selectedNodes.length > 0) {
                        classObject.push({"id" : "" + currentNode['id'] + "", "name": ""+ currentNode['label'] + "", "section":  this.selectedNodes, "sectionNode":selectedSectionNodes});
                    }
                }

            } else if (hash[node].selected) {
                let currentNode = hash[node];
                if (currentNode.parentNodeId == 0) {
                    userType.push(currentNode['label']);
                    for (let child in currentNode.children){
                        var selectedSectionNodes = [];
                        this.selectedNodes = [];
                        let currentNode1 = currentNode.children[child];                        
                        if(currentNode1.selected || currentNode1.partialSelection ){
                            for (let child in currentNode1.children) {
                                let child1 = currentNode1.children[child];
                                if(child1.selected) {
                                    selectedSectionNodes.push({id: child1['id'], name: child1['label']});
                                    this.selectedNodes.push(child1['id']);
                                }
                            }
                        }
                        classObject.push({"id" : "" + currentNode1['id'] + "", "name": ""+ currentNode1['label'] + "", "section":  this.selectedNodes, "sectionNode":selectedSectionNodes});

                    }
                }
            }
        }
        return {classObject, userType};
    }

    updateEmpSelected(hash: any) {
        this.selectedNodes = [];
        for (let node in hash) {
            let currentNode = hash[node];
            if (currentNode.parentNodeId == 0 && currentNode.partialSelection && currentNode['category_id'] == '45c1e4e8-23b3-43cc-81e8-5999884d51f5') {
                for (let key in currentNode.children){
                    var child = currentNode.children[key]
                    if(child.selected) {
                        this.selectedNodes.push(child['id']);
                    }
                }
            }
        }
        return this.selectedNodes;
    }

    buildDataUpdateHierarchy(data:any[], updateData: any[]):any {
        let id = 1;
        let hash = {};
        let setNodeID = (node:any, parentId:number) => {
            hash[id] = node;
            node['selected'] = node.selected;
            node['partialSelection'] = node.partialSelection;
            node['nodeId'] = id;
            node['parentNodeId'] = parentId;
            node['expanded'] = node.expanded;
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
            setNodeID(node, 0);
        });
        return hash;
    }

    checkSelected(id: any, notified: any[]): boolean {
        for(let obj in notified) {
            let cat: any = notified[obj];
            if (cat.category_id == id) {
                return true;
            }
        }

        return false;
    }

    checkPartiallySelected(id: any, notified: any[]): boolean {
        for(let obj in notified) {
            let cat: any = notified[obj];
            if (cat.category_id == id && cat.partialSelection ) {
                return true;
            }
        }

        return false;
    }

    checkExpanded(id: any, notified: any[]): boolean {
        for(let obj in notified) {
            let cat: any = notified[obj];
            if (cat.parentNodeId == 0 && id.parentNodeId == 0) {
                return true;
            } else if (cat.category_id == id.category_id && cat.expanded) {
                return true;
            }
        }
        return false;
    }

    getTreeJson(data : any) {
        var arr:any[] = [];
        for(let obj in data) {
            var item = data[obj];
            var parentNodeId = "";
            if(item.selected || item.partialSelection){
                if(item.parent != undefined) {
                    parentNodeId = item.parent.parentNodeId;
                }
                arr.push({category_id: item.category_id, selected: item.selected, partialSelection: item.partialSelection, expanded: item.expanded ,parentNodeId : parentNodeId,
                    label: item.label});
            }
        }
        return arr;
    }

    getSelectedNodes(hash: any) :any[] {
        var selectedNodes = [];
        for (let node in hash) {
            if (hash[node].selected) {
                selectedNodes.push(hash[node]['category_id'])
            }
        }

        return selectedNodes;
    }

    UpdateDisabledNodes(hash: any) {
        this.hash = hash
        this.nonDisabledNodes = []
        for (let i in hash) {
            var node = hash[i]
            if (node.selected || node.partialSelection && node['category_id'] != "331dc52c-b36d-4c1b-a5ad-e2e402bfe485") {
                this.setNonDisabledNodes(node)
            }
        }
    }

    setNonDisabledNodes(toggleNode: any) {
        let toggleChildren = (node:any) => {
            this.nonDisabledNodes.push(node['category_id'])
            node.children.forEach(function (child:any) {
                toggleChildren(child);
            });
        }

        toggleChildren(toggleNode);
        this.updateDisableNodes(this.hash, this.nonDisabledNodes)
    }

    updateDisableNodes(hash: any, nonDisabledNodes: any[]) {
        for (let i in hash) {
            var node = hash[i]
            if(nonDisabledNodes.length && nonDisabledNodes.indexOf(node.category_id) == -1 || this.defaultDisabledNodes.indexOf(node.category_id) > -1) {
                node.disabled = true;
            } else {
                node.disabled = false;
            }
        }
    }

}
