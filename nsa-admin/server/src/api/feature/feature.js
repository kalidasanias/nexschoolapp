/**
 * Created by Kiranmai A on 2/8/2017.
 */

var express = require('express')
    , router = express.Router()
    , feature = require('../../services/feature/feature.service.js');

router.get('/active', feature.getActiveSchoolFeatures);
router.get('/app/active',feature.getActiveSchoolFeaturesMobile);
router.get('/channel/:featureId', feature.getFeatureChannelConfiguration);
router.get('/', feature.getFeatureDetails);
router.get('/channel', feature.getChannelFeatureDetails);
router.put('/channel', feature.updateChannelFeatureDetails);

module.exports = router;