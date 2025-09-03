/**
 * Created by Kiranmai A on 3/7/2017.
 */

var express = require('express'),
    router = express.Router(),
    conversation = require('../../services/conversation/conversation.service');

router.get('/user/comments/:featureDetailId', conversation.getUserComments);
router.get('/comments/:featureId', conversation.getFeatureComments);
router.post('/user/comment', conversation.saveUserComments);
router.put('/user/comment', conversation.updateUserComments);
router.get('/comments', conversation.getUnreadComments);

module.exports = router;