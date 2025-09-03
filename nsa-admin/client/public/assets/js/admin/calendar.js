/**
 * Created by senthil on 4/4/2017.
 */
var calendar = {
    enableFullCalendar: function(data, view) {
        $(data.eleAttr).fullCalendar( 'destroy' );
        var right = 'prev,next';
        var defaultView = 'agendaWeek';
        if(view == 'month') {
            right = '';
            defaultView = 'month'
        }
        $(data.eleAttr).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: right
            },
            defaultView: defaultView,
            hiddenDays: this.getHidableDays(data, view),
            navLinks: true,
            allDaySlot: false,
            selectable: true,
            selectHelper: data.hasRoleToEdit && data.showSelectHelper,
            height: $(window).height()*1.10,
            editable: false,
            contentHeight: 'parent',
            eventLimit: false, // allow "more" link when too many events
            axisFormat: 'h:mm A', // uppercase H for 24-hour clock
            timeFormat: 'h:mm ',
            snapOnSlots: {
                snapEffectiveDuration: false, // default: false
                snapPolicy: 'enlarge'         // default: 'enlarge', could also be 'closest'
            },
            slots: data.slots,
            events: data.events,
            eventColor: '#48c9d8',
            select: function(start, end, allDay, jsEvent, view) {
                if(data.hasRoleToEdit) {
                    var obj = {
                        start: start,
                        end: end,
                        startTime: moment(start).format('HH:mm:ss'),
                        endTime: moment(end).format('HH:mm:ss')
                    }
                    var isOverlaping = calendar.checkOverlap(obj, data)
                    if(isOverlaping && data.stopOverlap) {
                        $(data.eleAttr).fullCalendar('unselect');
                    } else {
                        $(data.newEventButton).val(JSON.stringify(obj)).trigger('click');
                    }
                }
            },
            eventRender: function (event, element) {
                element.find('.fc-time').hide();
                if(data.hasRoleToEdit) {
                    calendar.shoeEventMenu(event, element, data)
                }
            },
            eventAfterAllRender: function(view) {
                $('.fc-timeslots-break-content').html('Break Period').css('vertical-align', 'middle');
                $('.fc-axis.fc-widget-header').html('Periods');
            },

            eventAfterRender: function(event, element, view) {
            },

            eventClick: function(event, jsEvent, view) {
                var obj = calendar.removeCylicObj(event)
                $(data.viewMenu).val(obj);
                $(data.viewMenu).click();
            },

            eventMouseover: function (event, jsEvent, view) {
                calendar.showTooltip(event, this);
            },
            eventMouseout: function (data, event, view) {
                $(this).css('z-index', 8);
                $('.event-tooltip').remove();
            },

            viewRender: function (view, element) {
                var b = view.calendar.getDate();
                $(data.weekEle).val(b.format()).trigger('click')
            },
        });
    },

    calendarRefresh: function(data) {
        $(data.eleAttr).fullCalendar( 'removeEvents');
        $(data.eleAttr).fullCalendar( 'addEventSource', data);
        $(data.eleAttr).fullCalendar( 'rerenderEvents' );
    },

    checkOverlap: function (event, data) {
        var format = 'ddd MMM DD YYYY HH:mm:ss'
        var start = calendar.formatDate(event.start, format);
        var end = calendar.formatDate(event.end, format);
        var overlap = $(data.eleAttr).fullCalendar('clientEvents', function(ev) {
            if( ev == event)
                return false;
            var estart = calendar.formatDate(ev.start, format);
            var eend = calendar.formatDate(ev.end, format);

            return (Math.round(estart)/1000 < Math.round(end)/1000 && Math.round(eend) > Math.round(start));
        });
        if (overlap.length){
            return true;
        }
    },

    formatDate: function(date, format) {
        return new Date(moment(date).format(format));
    },

    renderEvent: function(eventData) {
        $('.fullcalendar').fullCalendar('renderEvent', eventData, true);
    },

    removeEvent: function(eventId) {
        $('.fullcalendar').fullCalendar('removeEvents', eventId, true);
    },

    updateEvent: function(eventData) {
        $('.fullcalendar').fullCalendar('updateEvent', eventData, true);
    },

    showEventPopup: function(event, data) {
        var slot = calendar.getCurrentSlotObj(data, event.startTime)
        $(data.newEvent).modal('show');
        $('#start').val(event.start);
        $('#end').val(event.end);
        $('#slot').val(JSON.stringify(slot));
    },

    getCurrentSlotObj: function(data, start) {
        var slots = data.slots;
        var slot = {};
        for (var key in slots) {
            var obj = slots[key];
            if (obj.start == start) {
                slot = obj
            }
        }

        return slot;
    },

    showTooltip: function (event, $this ) {
        var descriptions = event.description;
        var html = '';
            for (var key in descriptions) {

                var obj = descriptions[key];
                if(key == '') {
                    html = html+ '' + '</br>'
                } else {
                    html = html+key + ' : ' + obj + '</br>'
                }
            }
        if(event.title){
            var content = html == '' ? event.title + '</br>' : html;
            tooltip = '<div class="event-tooltip">' + content + '</div>';
            $("body").append(tooltip);
            $($this).mousemove(function (e) {
                var elementHeight = $(this).height();
                var offsetWidth = 20;
                var offsetHeight = 50;
                var toolTipWidth = $(".event-tooltip").width();
                var toolTipHeight = $(".event-tooltip").height();
                var documentWidth = $(document).width();
                var documentHeight = $(document).height();
                var top= e.pageY + 20 ;
                if (top + 50 + toolTipHeight > documentHeight) {
                    top = top - toolTipHeight - 55;
                }
                var left = e.pageX + offsetWidth;

                if (left + toolTipWidth > documentWidth) {
                    left = left - toolTipWidth - 10;
                   /* $("body").css({"overflow-x": "hidden" });*/
                }

                $('.event-tooltip').css({ 'top': top, 'left': left });
                $('.event-tooltip').show();
            });

            /*$($this).mouseover(function (e) {
                $('.event-tooltip').fadeIn('500');
                $('.event-tooltip').fadeTo('10', 1.9);
            }).mousemove(function (e) {
                $('.event-tooltip').css('top', e.pageY + 10);
                $('.event-tooltip').css('left', e.pageX + 20);
            });*/
        }
    },

    getHidableDays: function(data, view) {
        var missing = data.isTimetable ? [0] : [];
        if(view != 'month' && data.slots.length) {
            var mynumbers = data.slots[0].days;
            if(mynumbers!='udefined' && mynumbers.length) {
                for(var i=0; i <= 6; i++)
                {
                    if(mynumbers.indexOf(i) === -1) {
                        missing.push(i);
                    }
                }
            }
        }
        return missing;
    },

    shoeEventMenu: function(event, element, data) {
        var obj = calendar.removeCylicObj(event)
        var html = $(data.eventMenu).html();
        element.find(".fc-content").append(html);
        element.find("input.event-obj").val(obj);
    } ,

    removeCylicObj: function (obj) {
        var seen = [];
        var json = JSON.stringify(obj, function(key, val) {
            if (typeof val == "object") {
                if (seen.indexOf(val) >= 0)
                    return
                seen.push(val)
            }
            return val
        })

        return json;
    }

}
//ToDo
$(document).on('click', '[data-toggle=dropdown]', function () {
    $('.fc-time-grid-event').each(function(i, obj) {
        $(this).removeClass('z-index-8');
    });
    $(this).closest('.fc-time-grid-event').addClass('z-index-8');
});

/*$(document).on('click', 'body .timetable-save', function () {
    eventData = {
        title: $('#subject-select option:selected').text(),
        start: $('#start').val(),
        end: $('#end').val()
    };
    calendar.renderEvent(eventData);
    $('#modal_form_horizontal').modal('hide');
    $('#eventTitle').val('')
});*/

$(document).on('click', 'body .edit-event', function () {
    $('#eventEditButton').val($(this).next('.event-obj').val()).trigger('click');
});

$(document).on('click', 'body .add-event', function () {
    $('#eventAddButton').val($(this).next('.event-obj').val()).trigger('click');
});

$(document).on('click', 'body .upload-event', function () {
    $('#uploadButton').val($(this).next('.event-obj').val()).trigger('click');
});

$(document).on('click', 'body .download-event', function () {
    $('#downloadButton').val($(this).next('.event-obj').val()).trigger('click');
});

$(document).on('click', 'body .delete-attachment', function () {
    $('#deleteAttchment').val($(this).next('.event-obj').val()).trigger('click');
});

$(document).on('click', 'body .delete-event', function () {
    $('#eventWarningButton').val($(this).next('.event-obj').val()).trigger('click');
});




