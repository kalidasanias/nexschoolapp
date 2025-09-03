/**
 * Created by Anjan on 3/31/2017.
 */

var express = require('express')
    ,router = express.Router()
    ,aspects = require('../../services/aspects/aspects.service')
    ,validation = require('@nsa/nsa-commons').validator

router.get('/', aspects.getAllSchoolAspects);
router.get('/:id', aspects.getSchoolAspectsById);
router.post('/', aspects.saveSchoolAspects);
router.put('/:id', aspects.updateSchoolAspects);
router.delete('/:id', aspects.deleteSchoolAspects);


module.exports = router;