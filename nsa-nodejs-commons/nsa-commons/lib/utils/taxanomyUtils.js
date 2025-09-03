/**
 * Created by senthil on 3/9/2017.
 */
var _ = require('lodash');
var constants = require('../commons/constants');

var TaxanomyUtils = function f(options) {
    var self = this;
};

TaxanomyUtils.buildTaxanomyObj = function(req, callback) {
    var selectedNodes =  req.body.selectedNodes
    var taxanomy = req.body.taxanomy
    callback(null, updateTaxanomyObjs(taxanomy, selectedNodes))
};

TaxanomyUtils.mergeTaxanomyObj = function(taxanomy, selectedNodes, callback) {
    callback(null, updateTaxanomyObjs(taxanomy, selectedNodes))
};

TaxanomyUtils.extractAndMergeTaxanomyObj = function(taxanomy, selectedCategories, callback) {
    var selectedNodes = []
    var setChildren = function (obj) {
        if(obj.selected)
        selectedNodes.push(getAsString(obj.category_id))
        if (obj.children) {
            obj.children.forEach(function (obj) {
                setChildren(obj);
            });
        }
    }
    selectedCategories.forEach(function (obj) {
        setChildren(obj);
    });
    
    callback(null, updateTaxanomyObjs(taxanomy, selectedNodes))
};

function updateTaxanomyObjs(taxanomy, selectedNodes) {
    _.forEach(taxanomy, function(value, key) {
        var superParent = [];
        value.selected = (_.includes(selectedNodes, getAsString(value.category_id)))
        _.forEach(value.children, function(value, key) {
            var parent = [];
            value.selected = (_.includes(selectedNodes, getAsString(value.category_id)))
            updateSelection(value, selectedNodes, superParent);
            _.forEach(value.children, function(value, key) {
                value.selected = (_.includes(selectedNodes, getAsString(value.category_id)))
                updateSelection(value, selectedNodes, parent);
            });
            updatePartialSelection(value, parent)
            updateExpand(value)
        });
        updatePartialSelection(value, superParent)
        updateExpand(value)
    });

    return taxanomy
}
exports.updateTaxanomyObjs = updateTaxanomyObjs;

function updatePartialSelection(value, parent) {
    parent = _.uniq(parent);
    if(_.size(parent) > 1) {
        value.selected = false
        value.partialSelection = true
    }
};
exports.updatePartialSelection = updatePartialSelection;

function updateSelection(value, selectedNodes, parent) {
    parent.push(_.includes(selectedNodes, getAsString(value.category_id)))
};
exports.updateSelection = updateSelection;

function updateExpand(value) {
    if(value.selected || value.partialSelection) {
        value.expanded = true;
    }
};
exports.updateExpand = updateExpand;

module.exports = TaxanomyUtils;

function isString(value) {
    return typeof value === 'string' ? true : false
}

function getAsString(value) {
    if(isString(value)) {
        return value
    } else {
        return value.toString();
    }
}