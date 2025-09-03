/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , designation = require('../../services/user-mgmt/designation.service');

router.get('/', designation.getAllDesignations);
router.get('/:id', designation.getDesignation);
router.post('/', designation.saveDesignation);
router.put('/:id', designation.updateDesignation);
router.delete('/:id', designation.deleteDesignation);

module.exports = router;