/**
 * Created by senthil-p on 15/05/17.
 */

var taxanomyDomain = require('../common/domains/ClassTaxanomy'),
    models = require('../models'),
    constants = require('../common/constants/constants'),
    _ = require ('lodash'),
    logger = require('../../config/logger');


exports.taxanomy = function(req, data, level) {
    var taxanomyObjs = [];
    try {
        data.forEach(function (taxanomyObj) {
            var taxanomy = Object.assign({}, taxanomyDomain);
            taxanomy.category_id= taxanomyObj['category_id'],
            taxanomy.parent_id = taxanomyObj['parent_category_id'],
            taxanomy.id = taxanomyObj['id'],
            taxanomy.label = taxanomyObj['name'],
            taxanomy.order_by = taxanomyObj['order_by'],
            taxanomyObjs.push(taxanomy);
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return buildTaxanomyObj(taxanomyObjs, level);
};

function buildTaxanomyObj(data, level) {
    var parentData;
    try {
        var count = 0;
        parentData = _.sortBy(_.filter(data, {parent_id: models.uuidFromString(constants.TAXANOMY_ID)}), constants.ORDER_BY);
        var setChildren = function (obj) {
            count ++;
            var children = _.filter(data, {parent_id: obj.category_id})
            obj['children'] = _.sortBy(children, child => child.label.toLowerCase());
            if (children.length && count < level) {
                children.forEach(function (obj) {
                    setChildren(obj);
                });
            }
        }
        parentData.forEach(function (obj) {
            count = 1;
            if(count < level) {
                setChildren(obj);
            }
        });
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return parentData;
};
exports.buildTaxanomyObj = buildTaxanomyObj;


exports.deptTaxanomy = function(req, data, level) {
    var taxanomyObjs = [];
    try {
        data.forEach(function (taxanomyObj) {
            var taxanomy = Object.assign({}, taxanomyDomain);
            taxanomy.category_id= taxanomyObj['category_id'],
                taxanomy.parent_id = taxanomyObj['parent_category_id'],
                taxanomy.id = taxanomyObj['id'],
                taxanomy.label = taxanomyObj['name'],
                taxanomy.order_by = taxanomyObj['order_by'],
                taxanomyObjs.push(taxanomy);
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return buildDeptTaxanomyObj(taxanomyObjs, level);
};

function buildDeptTaxanomyObj(data, level) {
    var parentData;
    try {
        var count = 0;
        parentData = _.sortBy(_.filter(data, {parent_id: models.uuidFromString(constants.DEPT_TAXANOMY_ID)}), constants.ORDER_BY);
        var setChildren = function (obj) {
            count ++;
            var children = _.filter(data, {parent_id: obj.category_id})
            obj['children'] = _.sortBy(children, child => child.label.toLowerCase());
            if (children.length && count < level) {
                children.forEach(function (obj) {
                    setChildren(obj);
                });
            }
        }
        parentData.forEach(function (obj) {
            count = 1;
            if(count < level) {
                setChildren(obj);
            }
        });
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return parentData;
};
exports.buildTaxanomyObj = buildTaxanomyObj;