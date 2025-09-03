/**
 * Created by senthil on 02/08/17.
 */
var edit = false;
function enableLightGallery() {
    edit = false
    $(".image-container").rowGrid({itemSelector: ".item", minMargin: 2, maxMargin: 2, firstItemClass: "first-item"});
    var lg = $('#lightgallery').lightGallery();
    if (lg.data('lightGallery'))
        lg.data('lightGallery').destroy(true);
    $('#lightgallery').lightGallery({
        vimeoPlayerParams: {
        byline : 0,
        title: 0,
        portrait : 0
        }
    });
    updateSelected();
}

function destroyLightGallery() {
    edit = true
    var lg = $('#lightgallery').lightGallery();
    if (lg.data('lightGallery'))
        lg.data('lightGallery').destroy(true);
}

function flex() {
    $('.flexslider').flexslider({
        touch: false,
        slideshow: true,
        controlNav: false,
        slideshowSpeed: 2000,
        animationSpeed: 500,
        directionNav: false,
        initDelay: 0,
        start: function(slider) { // Fires when the slider loads the first slide
            var slide_count = slider.count - 1;

            $(slider)
                .find('img.lazy:eq(0)')
                .each(function() {
                    var src = $(this).attr('data-src');
                    $(this).attr('src', src).removeAttr('data-src');
                });
        },
        before: function(slider) { // Fires asynchronously with each slider animation
            var slides     = slider.slides,
                index      = slider.animatingTo,
                $slide     = $(slides[index]),
                $img       = $slide.find('img[data-src]'),
                current    = index,
                nxt_slide  = current + 1,
                prev_slide = current - 1;

            $slide
                .parent()
                .find('img.lazy:eq(' + current + '), img.lazy:eq(' + prev_slide + '), img.lazy:eq(' + nxt_slide + ')')
                .each(function() {
                    var src = $(this).attr('data-src');
                    $(this).attr('src', src).removeAttr('data-src');
                });
        }
    });
}

$(document).on('click', 'li.my-filter', function(){
    $('.parent-filter').removeClass("active");
    $('.my-filter').removeClass("active");
    $(this).parent("ul").parent("li").addClass("active");
    $(this).addClass('active');
});

$(document).on('click', '.select-tic', function() {
    if($(this).hasClass('active')) {
        $(this).removeClass('active').addClass('in-active');
    } else if ($(this).hasClass('in-active')) {
        $(this).removeClass('in-active').addClass('active');
    }
    updateSelected();
});

$(document).on('click', '.image-edit', function() {
    destroyLightGallery();
    $('#image-select-all').prop('checked', true);
    selectOption.selectStyle()
    $('.image-edit').attr('disabled', 'disabled');
    $('.image-edit').addClass('icon-default').removeClass('icon-primary');
    $('.select-tic').each(function () {
        $(this).addClass('active');
    })
    updateSelected();
});

$(document).on('click', '#image-select-all', function() {
    if(edit)
        if ($(this).is(':checked')) {
            selectImages();
        } else {
            deselectImages();
        }
});

$(document).on('click', '#seleted-close', function(){
    removeEditImages();
});

function deselectImages() {
    $('.select-tic').each(function () {
        $(this).removeClass('active').addClass('in-active');
    })
    $('#image-select-all').prop('checked', false);
    selectOption.selectStyle()
    updateSelected();
}

$(document).on('click', 'body .confirm', function () {
    edit = false
});

function removeEditImages() {
    enableLightGallery();
    $('.image-edit').removeAttr('disabled').removeClass('icon-default').addClass('icon-primary');
    $('.select-tic').each(function () {
        $(this).removeClass('active in-active');
    })
    updateSelected();
}

function selectImages() {
    $('.select-tic').each(function () {
        $(this).addClass('active').removeClass('in-active');
    })
    updateSelected();
}


function updateSelected() {
    var count = 0;
    var seletedObjIds = []
    var seletedImageIds = []
    var seletedVideoIds = []
    $('.select-tic').each(function () {
        if($(this).hasClass('active')){
            var videoId = $(this).attr('data-video')
            if(videoId != undefined)
                seletedVideoIds.push(videoId)
            var imageId = $(this).attr('data-id')
            if(imageId != undefined)
                seletedImageIds.push(imageId)
            seletedObjIds.push($(this).attr('id'))
            count ++;
        }
    })
    var seletedIds = JSON.stringify({seletedObjIds: seletedObjIds, seletedImageIds: seletedImageIds, seletedVideoIds: seletedVideoIds})

    var html = '<span class="label label-primary label-rounded">'+'  Selected : ' + count + '</span><a><i id="seleted-close" class="fa fa-times-circle-o fa-lg"></i></a>'
    if(count > 0) {
        $('#delete-selected').removeAttr('disabled').removeClass('icon-default').addClass('icon-primary');
        $('#seleted-values').val(seletedIds);
        $('#seleted-close, #image-select').removeClass('hide');
        $('#seleted-images').html(html);
    } else {
        $('#delete-selected').attr('disabled', 'disabled').addClass('icon-default').removeClass('icon-primary');
        $('#seleted-values').val(seletedIds);
        $('#seleted-close, #image-select').addClass('hide');
        $('#seleted-images').text('');
    }

    if(edit) {
        $('#image-select').removeClass('hide');
        $('#seleted-images').html(html);
    } else {
        $('#image-select-all').prop('checked', true);
    }
}