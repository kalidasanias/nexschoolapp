/* ------------------------------------------------------------------------------
*
*  # Buttons extension for Datatables. HTML5 examples
*
*  Specific JS code additions for datatable_extension_buttons_html5.html page
*
*  Version: 1.0
*  Latest update: Nov 9, 2015
*
* ---------------------------------------------------------------------------- */
var promoteList;
var shuffleList;
var promotedData;
function enableDataSourceScholar(url, headers) {

    $(function () {
        enabledataBtn();
        $.fn.dataTable.ext.errMode = 'throw'
            // Column selectors
        $('.datatable-export21').DataTable();

            var leave = $('.datatable-requested-leaves').DataTable({
                ajax: {
                    url: url,
                    headers: headers,
                    dataFilter: function(data){
                        return validateData(data);
                    }
                },
                "processing": true,
                order: [1, 'desc'],
                columnDefs: [
                    /*{
                     targets: 4,
                     data: null,
                     defaultContent: "<a class='icon-primary' id='editDepartment'><i class='fa fa-pencil-square-o fa-lg'></i></a>&nbsp;<a id='delDep'class='icon-danger'><i class='fa fa-trash-o fa-lg'></i></a>"
                     },*/
                    {
                        orderable: false,
                        targets: [0, 4]
                    }],
                columns: [
                    {data: "empId", "orderable":"true"},
                    {data: "empName"},
                    {data: "",
                        render: function (data, type, row) {
                            return row.fromDate + ' - ' + row.toDate;
                        },
                    },
                    {data: "",
                        render: function (data, type, row) {
                            var status = ' label-success';
                            if (row.status == "Deny") {
                                status = ' label-danger'
                            } else if(row.status == "Cancelled"){
                                status = ' label-danger'
                            } else if(row.status == "Pending") {
                                status = ' label-warning'
                            }

                            return "<span class='label" + status + "'>" + row.status + "</span>"
                        },
                    },
                    {data: '',
                        render: function ( data, type, row, meta) {
                            if(isCurrentYear()) {
                                if(row.status == 'Cancelled') {
                                    return "<button id='respond' disabled class='btn btn-primary'>Respond</button>"
                                } else {
                                    return "<button id='respond' class='btn btn-primary'>Respond</button>"
                                }
                            } else {
                                return "<button id='respond' disabled class='btn btn-primary'>Respond</button>"
                            }
                        }},
                ]
            });

            $('.datatable-requested-leaves tbody').on('click', 'button#respond', function () {
                var data = leave.row($(this).parents('tr')).data();
                if (data != undefined) {
                    $('#resLeav').attr('data-title', 'Leave Request - ' + data.empName);
                    $('#resLeav').val(JSON.stringify(data));
                    $('#resLeav').click();
                }

            });

        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });

    });
}

function enableMarkUploadDataTable(id, columns, columnsDef, data) {
    $(function () {
        enabledataBtn();
        $.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) {
            console.log('datatable Error', message);
        };
        var data_table = $(id).DataTable({
            "destroy": true,
            "aaData": data,
            "aoColumns": columns,
            "aoColumnDefs": columnsDef,
            'order': [[0, 'asc']]
        });

        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });
    })
}

function enableSourceDataTable(id, data) {
    $(function () {
        $.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) {
            console.log('datatable Error', message);
        };
        if(id == '.datatable-promote-student-list') {
            promotedData = data;
            promoteList = $(id).DataTable({
                "destroy": true,
                "aaData": data.users,
                "aoColumns": [
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            return '<input type="checkbox" name="id[]" checked="checked" data-value="' + row.user_name + '" value="' + row.user_name +'">'
                        }},
                    {data: "user_code", "orderable":"true"},
                    {data: "first_name"},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                        console.log("sss", row.classes[0].class_name)
                            return row.classes[0].class_name;
                        }},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            return row.classes[0].section_name;
                        }},
                ],
                "aoColumnDefs": [
                    {
                        orderable: false,
                        targets: [0, 2]
                    }],
                'order': [[0, 'asc']]
            });

        } else if(id == '.datatable-shuffle-student-list') {
            console.log("data", data)
            shuffleList = $(id).DataTable({
                "destroy": true,
                "aaData": data.users,
                "lengthMenu": [ [ 10, 25, 50, 100, 10000 ],  [ '10', '25', '50', '100', 'All' ]],
                "aoColumns": [
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            return '<input type="checkbox" name="id[]" data-value="' + row.user_name + '" value="' + row.user_name +'">'
                        }},
                    {data: "user_code", "orderable":"true"},
                    {data: "first_name"},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            console.log("sss", row.classes[0].class_name)
                            return row.classes[0].class_name;
                        }},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            return row.classes[0].section_name;
                        }},
                ],
                "aoColumnDefs": [
                    {
                        orderable: false,
                        targets: [0, 2]
                    }],
                'order': [[0, 'asc']]
            });

        } else {
            var finalList = $(id).DataTable({
                "destroy": true,
                "aaData": data,
                "aoColumns": [
                    {data: "user_code", "orderable":"true"},
                    {data: "first_name"},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            return row.classes[0].class_name;
                        }},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            return row.classes[0].section_name;
                        }},
                ],
                "aoColumnDefs": [
                    {
                        orderable: false,
                        targets: [0, 2]
                    }],
                'order': [[0, 'asc']]
            });
        }
        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });
    })

}


$(function () {
    $(document).on('keyup change', '.child input', function(e) {
        var table = $('.mark-upload').DataTable();
        var $el = $(this);
        var rowIdx = $el.closest('ul').data('dtr-index');
        var colIdx = $el.closest('li').data('dtr-index');
        var cell = table.cell({ row: rowIdx, column: colIdx }).node();

        var title = table.column( colIdx ).header();
        var data = table.row(rowIdx).data();

        var canUpdate = validateMark(data, $el.val(), $(title).text())
        if(!canUpdate) {
            $(this).closest('td').find('input').addClass('highlight')
            return false
        } else {
            $(this).closest('td').find('input').removeClass('highlight')
        }

        $('input', cell).val($el.val());

    });


    $(document).on('click', '#promoteList', function () {
        var data = promoteList.rows().data().data();
        var array = data;
        var newArray = jQuery.extend(true, [], array);
        var users = {};
        var promotedList = [];
        var failedList = [];
        var existingClass = {};
        var existingClasses = {};
        var promotedClasses = {};
        var newClasses = {};
        var preclasses = {};
        var sections = JSON.parse($('#updateSatus').val());
        var newClas = promotedData['newClass'];
        existingClass.sections = sections.existingSec;
        existingClasses.section = sections.onlyCureSecObj;
        promotedClasses.sections = sections.promotedSec;
        promotedClasses.id = newClas.class_id;
        promotedClasses.name = newClas.class_name;
        newClasses.section = sections.onlyPromSecObj;
        newClasses.id = newClas.class_id;
        newClasses.name = newClas.class_name;
        var checkboxes = promoteList.$('input[type="checkbox"]');
        for (var i =0; i < checkboxes.length; i++) {
            var user = {};

            var res = (newArray).filter( function(obj){ return obj.user_name == checkboxes[i].value});
            var oldData = (array).filter( function(obj){ return obj.user_name == checkboxes[i].value});
            user = res[0];
            if(checkboxes[i].checked) {
                if(res.length > 0) {
                    var classes = user.classes;
                    if (classes) {
                        existingClass.id = oldData[0].classes[0].class_id;
                        preclasses.class_id = oldData[0].classes[0].class_id;
                        preclasses.class_name = oldData[0].classes[0].class_name;
                        preclasses.class_code = oldData[0].classes[0].class_code;
                        preclasses.section_id = oldData[0].classes[0].section_id;
                        preclasses.section_name = oldData[0].classes[0].section_name;
                        preclasses.section_code = oldData[0].classes[0].section_code;
                        existingClass.name = oldData[0].classes[0].class_name;
                        existingClasses.id = oldData[0].classes[0].class_id;
                        existingClasses.name = oldData[0].classes[0].class_name;

                        var sectionFound = $.grep(sections.sectionObjs, function(e){ return e.id == classes[0].section_id });
                        if(sectionFound.length > 0) {
                            user.newClassId = newClas.class_id;
                            user.newSectionId = sectionFound.length > 0 ? sectionFound[0].sectionId : "" ;
                            user.classes[0].class_id = newClas.class_id;
                            user.classes[0].class_name = newClas.class_name;
                            user.classes[0].class_code = newClas.class_code;
                            user.classes[0].section_id = sectionFound[0].sectionId;
                            user.classes[0].section_name = sectionFound[0].sectionName;
                            user.classes[0].section_code = sectionFound[0].sectionCode;
                        }

                    }
                }
                user.preclasses =  [preclasses];
                promotedList.push(user);
            } else {
                failedList.push(user);
            }
            users.year = $('.curAcademicYear').val();
            users.academicYear = $('.newAcademicYear').val();
            users.existingClass = [existingClass];
            users.existingClasses = [existingClasses];
            users.promotedClasses = [promotedClasses];
            users.classes = [newClasses];
            users.sectionObjs = sections.sectionObjs;
            users['users'] = promotedList;
            users['failedUsers'] = failedList;
            if ( i === (checkboxes.length - 1)) {
                $('#promoteCreated').val(JSON.stringify(users));
                $('#promoteCreated').click();
            }

        }
    });

    $(document).on('click', '#shuffle-select-all', function () {
        var rows = shuffleList.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    $(document).on('click', '#promotions-select-all', function () {
        var rows = promoteList.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    $(document).on('click', '#shuffleList', function () {
        var data = shuffleList.rows().data().data();
        var array = data;
        var newArray = jQuery.extend(true, [], array);
        var users = {};
        var userList = [];
        var oldUserList = [];
        var promotedClasses = {};
        var newClasses = {};
        var sectionObj = {};
        var sections = JSON.parse($('#updateSatus').val());

        promotedClasses.sections = [{"id": sections[0].sectionId, "name": sections[0].sectionName}];
        var checkboxes = shuffleList.$('input[type="checkbox"]');
        if(checkboxes.length > 0) {
            for (var i =0; i < checkboxes.length; i++) {
                var user = {};

                var res = (newArray).filter( function(obj){ return obj.user_name == checkboxes[i].value});
                var oldres = (array).filter( function(obj){ return obj.user_name == checkboxes[i].value});
                user = res[0];
                if(checkboxes[i].checked) {
                    if(res.length > 0) {
                        var classes = user.classes;
                        promotedClasses.id = classes[0].class_id;
                        promotedClasses.name = classes[0].class_name;
                        if (classes) {
                            user.newClassId = classes[0].class_id;
                            user.newSectionId = sections[0].sectionId;
                            user.classes[0].section_id = sections[0].sectionId;
                            user.classes[0].section_name = sections[0].sectionName;
                            user.classes[0].section_code = sections[0].sectionCode;

                        }
                    }
                    userList.push(user);
                    oldUserList.push(oldres[0]);
                }
                users.year = $('.scurAcademicYear').val();
                users.academicYear = $('.snewAcademicYear').val();
                users.promotedClasses = [promotedClasses];
                users['users'] = userList;
                users['oldUsers'] = oldUserList;
                if ( i === (checkboxes.length - 1)) {
                    $('#shuffleStud').val(JSON.stringify(users));
                    $('#shuffleStud').click();
                }

            }
        } else {
            users.year =  $('.scurAcademicYear').val();
            users.academicYear = $('.snewAcademicYear').val();
            users.promotedClasses = [promotedClasses];
            users['users'] = userList;
            users['oldUsers'] = oldUserList;
            $('#shuffleStud').val(JSON.stringify(users));
            $('#shuffleStud').click();
        }

    });


    $(document).on('click', 'td .update-mark', function () {
        var data_table = $('.mark-upload').DataTable();
        row = $(this).parents('tr');
        var pointer = $(this).closest('td').parents('tr').next('tr').find('input:first')
        var data = data_table.row($(this).closest('td').parents('tr')).data();
        var newTotal = 0;
        var canUpdate = true;
        $(this).parents('tr').find('.inputbox-datatable-size').each(function (i, obj) {
            var newVal = $(this).closest('td').find('input').val() || 0;
            var ht = "<input type='text' name='exam1' class='form-control inputbox-datatable-size' value= " + newVal + "><span style='display: none;'>" + newVal + "</span>"
            var cell = data_table.cell($(this).closest('td'));

            var index = cell.index().column;
            var title = data_table.column( index ).header();

            canUpdate = validateMark(data, newVal, $(title).text())
            if(!canUpdate) {
                var message = "Entered Marks Exceeds the Maximum Mark OR Invalid Value"
                showNotification("Update Error!!", message, 'bg-danger');
                $(this).closest('td').find('input').addClass('highlight')
                return false
            }
            cell.data(ht);
            if ($.isNumeric(newVal)) {
                newTotal += parseFloat(newVal)
            }
        });
        data.Total = newTotal % 1 == 0 ? newTotal : newTotal.toFixed(2)
        if(canUpdate)
        data_table.row($(this).parents('tr')).data(data);
        $(pointer).focus();
        //dbclick not working
        $(row).find('.sorting_1').click().click()
        var id = generateRandomString();
        $('.update-mark', row).each(function () {
            $(this).attr('id', id)
            enableBtnLoading(id)
        })
        if (data != undefined) {
            var obj = {data: data, row: id}
            $('#upload-mark').val(JSON.stringify(obj));
            $('#upload-mark').click();
        }
    });
})

function validateMark(data, val, subject) {
    var maxMarkObject = data.maxMarkObject
    if(maxMarkObject.hasOwnProperty(subject)) {
        var maxMark = maxMarkObject[subject]
       return maxMark >= val && 0 <= val? true : false
    }
    return false
}


$(document).on('keydown','.inputbox-datatable-size', function(event) {
    var value = null, doPrevent = false;
    if (event.shiftKey == true) {
        event.preventDefault();
    }
    if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 ||
        event.keyCode == 46 || event.keyCode == 190) {
       if (event.originalEvent && event.originalEvent.target) {
            var self = $(this);
            setTimeout(function() {
                value = event.originalEvent.target.value;
                if (value.indexOf('.') !== -1) {
                    var decimalValue = value.substr(value.indexOf('.') + 1);
                    if (decimalValue.length === 3) {
                        self.val(value.substring(0, value.indexOf('.') + 3));
                    }
                }
            }, 10);
        }

    } else {
        if (((event.keyCode == 65 || event.keyCode == 86 || event.keyCode == 67) &&
            (event.ctrlKey === true || event.metaKey === true))) {
        } else {
            event.preventDefault();
        }
    }

    if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
        event.preventDefault();

    if (doPrevent) event.preventDefault();

    function prevent2Decimal() {
        value = event.originalEvent.target.value;
        if (value.indexOf('.') !== -1) {
            var decimalValue = value.substr(value.indexOf('.') + 1);
            if (decimalValue.length > 2) {
                doPrevent = true;
                event.preventDefault();
            }
        }
    }

});




function hasDecimalPlace(event, value, x)
{
    var pointIndex = value.indexOf('.');
    var decimalValue = value.substr(pointIndex + 1);
    value = value.substr(0, pointIndex);
    return pointIndex >=0 && decimalValue.length < x ;
}


$(document).on("focus","input.highlight",function () {
    $(this).removeClass('highlight');
})


$(document).on("mouseenter","th.th-title",function () {
    $(this).attr('title', $(this).text());
})

function enabledataBtnWithoutButtons() {
    $('.dataTables_filter').removeAttrs('style')
    $.extend($.fn.dataTable.defaults, {
        autoWidth: false,
        "pageLength": 25,
        dom: '<"datatable-header"fBl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
        language: {
            search: '<span>Search:</span> _INPUT_',
            searchPlaceholder: 'Type to search...',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: {'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;'},
            sZeroRecords: "No data available in table"
        },
        select: {
            style: 'multi'
        },
        responsive: true,
        columnDefs: [
            {responsivePriority: 1, targets: 0},
            {responsivePriority: 2, targets: -1},
        ],
        buttons: {}
    });


}

function enabledataBtn() {
        $('.dataTables_filter').removeAttrs('style')
        $.extend($.fn.dataTable.defaults, {
            autoWidth: false,
            "pageLength": 25,
            dom: '<"datatable-header"fBl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
            language: {
                search: '<span>Search:</span> _INPUT_',
                searchPlaceholder: 'Type to search...',
                lengthMenu: '<span>Show:</span> _MENU_',
                paginate: {'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;'}
            },
            select: {
                style: 'multi'
            },
            responsive: true,
            columnDefs: [
                {responsivePriority: 1, targets: 0},
                {responsivePriority: 2, targets: -1},
            ],
            buttons: {
                dom: {
                    button: {
                        className: 'btn btn-default btn-sm'
                    }
                },
                buttons: [
                    'selectAll',
                    'selectNone',
                    {
                        extend: 'collection',
                        text: '<i class="icon-copy3 position-left"></i> COPY',
                        buttons: [
                            {
                                extend: 'copyHtml5',
                                text: 'All',
                                exportOptions: {
                                    columns: ':visible',
                                }
                            },
                            {
                                extend: 'copyHtml5',
                                text: 'Selected',
                                exportOptions: {
                                    columns: ':visible',
                                    modifier: {
                                        selected: true
                                    }
                                }
                            }
                        ]
                    },

                    {
                        extend: 'collection',
                        text: '<i class="icon-file-excel position-left"></i> EXCEL',
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: 'All',
                                exportOptions: {
                                    columns: ':visible',
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                text: 'Selected',
                                exportOptions: {
                                    columns: ':visible',
                                    modifier: {
                                        selected: true
                                    }
                                }
                            }
                        ]
                    },
                    {
                        extend: 'collection',
                        text: '<i class="icon-file-spreadsheet position-left"></i> CSV',
                        buttons: [
                            {
                                extend: 'csvHtml5',
                                text: 'All',
                                exportOptions: {
                                    columns: ':visible',
                                }
                            },
                            {
                                extend: 'csvHtml5',
                                text: 'Selected',
                                exportOptions: {
                                    columns: ':visible',
                                    modifier: {
                                        selected: true
                                    }
                                }
                            }
                        ]
                    },
                    {
                        extend: 'collection',
                        text: '<i class="icon-file-pdf position-left"></i> PDF',
                        buttons: [
                            {
                                extend: 'pdfHtml5',
                                text: 'All',
                                exportOptions: {
                                    columns: ':visible',
                                }
                            },
                            {
                                extend: 'pdfHtml5',
                                text: 'Selected',
                                exportOptions: {
                                    columns: ':visible',
                                    modifier: {
                                        selected: true
                                    }
                                }
                            }
                        ]
                    },
                    {
                        extend: 'collection',
                        text: '<i class="icon-printer position-left"></i> Print',
                        buttons: [
                            {
                                extend: 'print',
                                text: 'All',
                                exportOptions: {
                                    columns: ':visible',
                                }
                            },
                            {
                                extend: 'print',
                                text: 'Selected',
                                exportOptions: {
                                    columns: ':visible',
                                    modifier: {
                                        selected: true
                                    }
                                }
                            }
                        ]

                    },
                    {
                        extend: 'colvis',
                        text: '<i class="icon-three-bars"></i> <span class="caret"></span>',
                        className: 'btn-icon'
                    }
                ]
            }
        });
}

