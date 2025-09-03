/**
 * Created by Kiranmai A on 1/19/2017.
 */

var express = require('express')
    , router = express.Router()
    , classes = require('../../services/class/class.service.js');

router.get('/', classes.getClasses);
router.get('/active', classes.getActiveClasses);
router.get('/sections', classes.getAllClassAndSections);
router.get('/:id', classes.getClassByClassId);
router.put('/:id', classes.updateClassStatus);

module.exports = router;