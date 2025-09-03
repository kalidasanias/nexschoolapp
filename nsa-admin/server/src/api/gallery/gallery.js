/**
 * Created by Deepa on 6/21/2017.
 */
var express = require('express')
    , router = express.Router()
    , gallery = require('../../services/gallery/gallery.service.js');

router.get('/category', gallery.getCategories);
router.get('/', gallery.getAlbumDetails);
router.get('/album/details', gallery.getAlbumDetails);
router.post('/', gallery.saveAlbums);
router.put('/:id', gallery.updateAlbums);
router.post('/details', gallery.saveAlbumsContentDetails);
router.get('/details/:id', gallery.getAlbumContent);
router.delete('/details', gallery.deleteAlbumDetailsByIds);
router.delete('/:id', gallery.deleteAlbumDetails);

module.exports = router;