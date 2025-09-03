/**
 * Created by kiranmai on 7/31/17.
 */

var _ = require('lodash'),
    GalleryDetailsDomain = require('../common/domains/GalleryDetails');

exports.galleryObjs = function(data) {
    var convertGalleryObjs = [];
    try {
        if(!_.isEmpty(data)) {
            _.forEach(data, function(value, key) {
                var galleryObj = Object.assign({}, GalleryDetailsDomain);
                    galleryObj.album_id= value['album_id'],
                    galleryObj.tenant_id= value['tenant_id'],
                    galleryObj.school_id= value['school_id'],
                    galleryObj.academic_year= value['academic_year'],
                    galleryObj.category= value['category'],
                    galleryObj.category_objs= value['category_objs'],
                    galleryObj.name= value['name'],
                    galleryObj.description= value['description'],
                    galleryObj.preview_thumbnails= value['preview_thumbnails'],
                    galleryObj.viewed_by= value['viewed_by'],
                    galleryObj.viewed_count = value['viewed_count'],
                    galleryObj.no_of_files_contains= value['tenant_id'],
                    galleryObj.shared_to= value['shared_to'],
                    galleryObj.created_by= value['created_by'],
                    galleryObj.created_date= value['created_date'],
                    galleryObj.updated_by= value['updated_by'],
                    galleryObj.updated_date= value['updated_date'],
                convertGalleryObjs.push(galleryObj);
            });
        }
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.GALLERY_DETAILS, constant.APP_TYPE, message.nsa1201, err.message, constant.HTTP_BAD_REQUEST);
    }
    return convertGalleryObjs;
};