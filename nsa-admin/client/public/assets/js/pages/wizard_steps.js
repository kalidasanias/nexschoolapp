function loadGoogleMap() {
    $(function () {
        var map = null, mapCenter = null;
        /*$(".steps-basic").steps({
            headerTag: "h6",
            bodyTag: "fieldset",
            transitionEffect: "slideLeft",
            titleTemplate: '<span class="number">#index#</span> #title#',
            labels: {
                finish: 'Submit'
            },

            onStepChanging: function (event, currentIndex, newIndex) {
                // Allways allow previous action even if the current form is not valid!
                if (currentIndex > newIndex) {
                    return true;
                }
                if (currentIndex < newIndex) {
                    var form = $(".routeWizardForm").show();
                    form.validate().settings.ignore = ":disabled,:hidden";
                    if(!form.valid()) {
                        return false;
                    }
                    if (currentIndex === 0) {
                        if (map != null) {
                            setTimeout(function () {
                                google.maps.event.trigger(map, 'resize');
                                map.setCenter(mapCenter);
                            }, 100);
                        } else {
                            map = createMap($('#city').val());
                            enableAutoCompleteAddress('fromAddress', 'fromLat', 'fromLng', map);
                            enableAutoCompleteAddress('toAddress', 'toLat', 'toLng', map);
                        }
                        $('#route').click(function () {
                            drawRoute(map, $('#fromLat').val(), $('#fromLng').val(), $('#toLat').val(), $('#toLng').val());
                            mapCenter = map.getCenter()
                        });
                        return true;
                    }

                }
                return true;
            },
            onFinished: function (event, currentIndex) {
                console.info('form valid...', $(".routeWizardForm").valid());

                // $(".routeWizardForm").submit(function(e){
                //     e.preventDefault();
                //     console.info('routeWizardForm submit....');
                //     $('#save').click();
                // });

                // $('#save').click();

                // $(".routeWizardForm").submit();
                $('#hiddenRoute').click();
            }
        });*/

    });

    /*$(".routeWizardForm").validate({
        errorClass: 'validation-error-label',
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        unhighlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        errorPlacement: function (error, element) {
            if (element.parents('div').hasClass('has-feedback') || element.hasClass('select2-hidden-accessible')) {
                error.appendTo( element.parent() );
            } else {
                error.insertAfter(element);
            }
        }
    });*/


    /*if (map != null) {
        setTimeout(function () {
            google.maps.event.trigger(map, 'resize');
            map.setCenter(mapCenter);
        }, 100);
    } else {*/
        var map = createMap($('#city').val());
        enableAutoCompleteAddress('fromAddress', 'fromLat', 'fromLng', map);
        enableAutoCompleteAddress('toAddress', 'toLat', 'toLng', map);
    // }

    // Hide if collapsed by default
    $('.panel-collapsed').children('.panel-heading').nextAll().hide();
    // Rotate icon if collapsed by default
    $('.panel-collapsed').find('[data-action=collapse]').children('i').addClass('rotate-180');

    // Collapse on click
    $('.panel [data-action=collapse]').click(function (e) {
        e.preventDefault();
        var $panelCollapse = $(this).parent().parent().parent().parent().nextAll();
        $(this).parents('.panel').toggleClass('panel-collapsed');
        $(this).toggleClass('rotate-180');
        var spanEle = $(this).parent().parent().parent().parent().find('.span-title-map');
        var h5Ele = $(this).parent().parent().parent().parent().find('.h5-title-map');
        var heading = $(this).parent().parent().parent().parent();

        heading.hasClass('title-toggle-width') ? heading.removeClass('title-toggle-width') : heading.addClass('title-toggle-width');
        spanEle.hasClass('hide') ? spanEle.removeClass('hide') : spanEle.addClass('hide');
        h5Ele.hasClass('hide') ? h5Ele.removeClass('hide') : h5Ele.addClass('hide');
        containerHeight(); // recalculate page height
        // $panelCollapse.slideToggle(150);
        $('#floating-panel-select').addClass('hide');

    });
    return map;
}

function containerHeight() {
    var availableHeight = $(window).height() - $('body > .navbar').outerHeight() - $('body > .navbar-fixed-top:not(.navbar)').outerHeight() - $('body > .navbar-fixed-bottom:not(.navbar)').outerHeight() - $('body > .navbar + .navbar').outerHeight() - $('body > .navbar + .navbar-collapse').outerHeight() - $('.page-header').outerHeight();
    $('.page-container').attr('style', 'min-height:' + availableHeight + 'px');
}

function plotMapRoute(route, map) {
    console.info('steps...plotMapRoute...',route);
    console.info('steps...plotMapRoute...',map);
    // var form = $(".routeWizardForm").show();
    // form.validate().settings.ignore = ":disabled,:hidden";
    // if(form.valid()) {
    if (route === null) {
        $('.panel [data-action=collapse]').click();
        $('#floating-panel-select').removeClass('hide');
    }

    console.info('plotMapRoute fromLat...', $('#fromLat'));
    console.info('plotMapRoute fromLng...', $('#fromLng'));
    drawRoute(map, $('#fromLat').val(), $('#fromLng').val(), $('#toLat').val(), $('#toLng').val(), route);
    // mapCenter = map.getCenter()

    // }
    // $('#'+event.srcElement.name).click();
}

