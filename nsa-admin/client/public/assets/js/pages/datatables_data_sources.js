/* ------------------------------------------------------------------------------
 *
 *  # Datatables data sources
 *
 *  Specific JS code additions for datatable_data_sources.html page
 *
 *  Version: 1.0
 *  Latest update: Aug 1, 2015
 *
 * ---------------------------------------------------------------------------- */
function enableDataSourceDatatable(url, headers) {
    $(function () {
        enabledataBtn();

        $.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) {
            console.log('datatable Error', message);
            /*showInformation('top', this.messages.delete_success, this.constants.n_success);*/
        };

        // HTML sourced data
        $('.datatable-html').dataTable();


        // AJAX sourced data
        $('.datatable-ajax').dataTable({
            ajax: url
        });

        // Javascript sourced data
        var dataSet = [
            ['Trident', 'Internet Explorer 4.0', 'Win 95+', '4', 'X'],
            ['Trident', 'Internet Explorer 5.0', 'Win 95+', '5', 'C'],
            ['Trident', 'Internet Explorer 5.5', 'Win 95+', '5.5', 'A'],
            ['Trident', 'Internet Explorer 6', 'Win 98+', '6', 'A'],
            ['Gecko', 'Firefox 1.0', 'Win 98+ / OSX.2+', '1.7', 'A'],
            ['Gecko', 'Firefox 1.5', 'Win 98+ / OSX.2+', '1.8', 'A'],
            ['Gecko', 'Firefox 2.0', 'Win 98+ / OSX.2+', '1.8', 'A'],
            ['Gecko', 'Firefox 3.0', 'Win 2k+ / OSX.3+', '1.9', 'A'],
            ['Gecko', 'Camino 1.0', 'OSX.2+', '1.8', 'A'],
            ['Gecko', 'Camino 1.5', 'OSX.3+', '1.8', 'A'],
            ['Webkit', 'Safari 1.2', 'OSX.3', '125.5', 'A'],
            ['Webkit', 'Safari 1.3', 'OSX.3', '312.8', 'A'],
            ['Webkit', 'Safari 2.0', 'OSX.4+', '419.3', 'A'],
            ['Presto', 'Opera 7.0', 'Win 95+ / OSX.1+', '-', 'A'],
            ['Presto', 'Opera 7.5', 'Win 95+ / OSX.2+', '-', 'A'],
            ['Misc', 'NetFront 3.1', 'Embedded devices', '-', 'C'],
            ['Misc', 'NetFront 3.4', 'Embedded devices', '-', 'A'],
            ['Misc', 'Dillo 0.8', 'Embedded devices', '-', 'X'],
            ['Misc', 'Links', 'Text only', '-', 'X']
        ];

        $('.datatable-js').dataTable({
            data: dataSet,
            columnDefs: []
        });
        $('.datatable-nested1').DataTable({});

        // Nested object data

        // Generate content for a column
        var table = $('.datatable-generated').DataTable({
            ajax: url,
            columnDefs: [{
                targets: 5,
                data: null,
                defaultContent: "<button class='btn border-blue text-blue'><i class='icon-trash'></i></button>"
            },
                {
                    orderable: false,
                    targets: [0, 3]
                }]
        });

        $('.datatable-generated tbody').on('click', 'button', function () {
            var data = table.row($(this).parents('tr')).data();
            $('#deleteButton').val(data[0]);
            $('#deleteButton').click();
        });

        var assignmentsView_1 = $('.datatable-assignment-view').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 5]
                }],
            columns: [
                {data: "firstName","orderable":"true"},
                {data: "className"},
                {data: "sectionName"},
                {data: "subjectName"},
                {data: "dueDate"},
                {data: "",
                    render: function ( data, type, row ) {
                        var returnData = "<span class='label assignment_status'></span>"
                        return returnData;
                    }},
            ],
            rowCallback: function (row, data) {
                if (data.isSubmitted == "Not Submitted") {
                    $(row).find(".assignment_status").removeClass('label-success').addClass('label-danger').text('InComplete');
                } else {
                    $(row).find(".assignment_status").removeClass('label-danger').addClass('label-success').text('Completed');
                }
            },
        });

        var studnetView = $('.datatable-student-list').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,
            order: [1, 'asc'],
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "user_name","orderable":"true"},
                {data: "first_name"},
                {data: '', "orderable":"true",
                    render: function ( data, type, row ) {
                    if(row.preclasses) {
                        return (row.preclasses[0].class_name + ' - ' + row.preclasses[0].section_name);
                    } else {
                        return " - ";
                    }

                    }},
                {data: '', "orderable":"true",
                    render: function ( data, type, row ) {
                        return (row.classes[0].class_name + ' - ' + row.classes[0].section_name);
                    }},
            ],
        });


        var attandanceView = $('.datatable-attandance-view').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }

            },"columnDefs": [ {
                "targets": 3,
                "searchable": false
            } ],
            columns: [
                {data: "attendanceDate", "orderable":"true"},
                {data: "remarks"},
                {data: "recordedUsername"},
                {data: "recordedDate"},
            ],
            "bDestroy": true

        });

        var assignFeeScholar = $('.datatable-scholarship-users').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [{
                targets: 7,
                defaultContent: "<a class='icon-primary ' id='feeScholar1'><i class='fa fa-pencil-square-o fa-lg'></i></a>&nbsp;<a id='feeScholarDelete1'class='icon-danger'><i class='fa fa-trash-o fa-lg'></i></a>"
            },
            {
                orderable: false,
                targets: [0, 7]
            }],
            columns: [
                {data: "userName", "orderable":"true"},
                {data: "firstName"},
                {data: "className"},
                {data: "sectionName"},
                {data: "totalScholarshipAmount"},
                {data: "feeDiscountAmount"},
                {data: "netAmount"},
            ]
        });

        $('.datatable-scholarship-users tbody').on('click', 'a#feeScholarDelete1', function () {
            var data = assignFeeScholar.row($(this).parents('tr')).data();
            if(data != undefined){
                $('#deleteChildButton').val(JSON.stringify(data));
                $('#feeScholarWarning').click();
            }
        });

        $('.datatable-scholarship-users tbody').on('click', 'a#feeScholar1', function () {
            var data = assignFeeScholar.row($(this).parents('tr')).data();
            if(data != undefined){
                $('#feeScholarEdit').val(data.feeAssignmentDetailId);
                $('#feeScholarEdit').click();
            }
        });

        $("#saveAttendance").click(function () {
            var data = recordAttendance.rows().data();
            var array = data.data();
            var matches = [];
            var final = [];
            var checkboxes = recordAttendance.$('input[type="checkbox"]');
            var testBox  =  recordAttendance.$('input[type="text"]');
            for (var i =0; i < checkboxes.length; i++) {
                var res = $.grep(array, function(e){ return e.userName == checkboxes[i].value });
                console.log( checkboxes[i].checked);
                res[0].isPresent = checkboxes[i].checked;
                matches.push(res[0]);
                if ( i === (checkboxes.length - 1)) {
                    for(var j=0; j < testBox.length; j++) {
                        var res = $.grep(matches, function(e){ return e.userName == $(testBox[j]).data('id') });
                        res[0].remarks = $(testBox[j]).val();
                        final.push(res[0])
                        if ( j === (testBox.length - 1)) {
                            if (final != undefined && final.length > 0) {
                                $('#saveAtdnce').val(JSON.stringify(final));
                                $('#saveAtdnce').click();
                            }
                        }
                    }
                }
            }
        });

//subjectAspects
        var subject_aspects = $('.datatable-aspects').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,

            columnDefs:[{
                targets: 3,
                data: null,
                defaultContent: "<a class='icon-primary' id='editAspect'><i class='fa fa-pencil-square-o fa-lg'></i></a>&nbsp;<a id='deleletAspect' class='icon-danger'><i class='fa fa-trash-o fa-lg'></i></a>"
            },
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns : [
                {data: "aspectName", "orderable":"true"},
                {data: "aspectCode"},
                {data: "updateddateAndName"}
            ]
        });

        $('.datatable-aspects tbody').on('click', 'a#deleletAspect', function(){
            var  data = subject_aspects.row($(this).parents('tr')).data();
            if(data != undefined){
                $('#deleteChildButton').val(JSON.stringify(data));
                $('#SubjectAspectWarning').click();
            }
        });


        $('.datatable-aspects tbody').on('click', 'a#editAspect', function () {
            var data = subject_aspects.row($(this).parents('tr')).data();
            if(data != undefined) {
                $('#AspectEdit').attr('data-title', 'Edit New Aspect');
                $('#AspectEdit').val(data.aspectId);
                $('#AspectEdit').click();
            }

        });




        

        var recordAttendance = $('.datatable-record-attendance').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateAttendanceData(data);
                }
            },
            "pageLength": 100,
            "processing": true,
            columnDefs: [{
                targets: 2,
                className: "text-center",
                'render': function (data, type, row){
                    var checked = 'checked';
                    if(row.isPresent) {
                        checked = 'checked';
                    } else {
                        checked = '';
                    }
                    return '<input type="checkbox" name="id[]" ' + checked + '  value="' + row.userName +'">';
                }

                 },
                {
                    targets: 3,
                    'render': function (data, type, row){
                        return '<input type="text" class="form-control" value="' + row.remarks + '" data-id="' + row.userName + '">';
                    }
                },
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            order: [1, 'asc'],
            columns: [
                {data: "admissionNo", "orderable":"true"},
                {data: "firstName"},
            ]
        });

        var promoteStudentList = $('.datatable-promote-student-list').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateAttendanceData(data);
                }
            },
            "pageLength": 100,
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 2]
                }],
            columns: [
                {data: '', "orderable":"true",
                    render: function ( data, type, row ) {
                        return '<input type="checkbox" name="id[]" checked="checked" data-value="' + row.user_name + '" value="' + row.user_name +'">'
                    }},
                {data: "user_name", "orderable":"true"},
                {data: "first_name"},
                {data: '', "orderable":"true",
                    render: function ( data, type, row ) {
                        return row.classes[0].class_name;
                    }},
                {data: '', "orderable":"true",
                    render: function ( data, type, row ) {
                        return row.classes[0].section_name;
                    }},
            ]
        });


        var studentReport = $('.datatable-student-report').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateAttendanceData(data);
                }
            },
            "pageLength": 100,
            "processing": true,
            columnDefs: [
            {
                orderable: false,
                targets: [0, 2]
            }],
            "order": [[ 2, "asc" ]],
            columns: [
                {data: '', "orderable":"true",
                    render: function ( data, type, row ) {
                        return '<input type="checkbox" name="id[]" checked="checked" data-value="' + row.user_name + '" value="' + row.user_name +'">'
                    }},
                {data: "user_name", "orderable":"true"},
                {data: "first_name"},
                {data: "primary_phone"},
            ]
        });


        var leaveTypes = $('.datatable-leaves').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 2]
                }],
            columns: [
                {data: '', "orderable":"true",
                    render: function ( data, type, row ) {
                       return '<input type="checkbox" name="id[]" data-value="' + row.leave_type_name + '" value="' + row.leave_type_id +'">'
                    }},
                {data: "leave_type_name"},
                {data: "description"},
                {data: '',
                    'render': function (data, type, row){
                        return '<input type="text" class="form-control" data-id="' + row.leave_type_id + '" data-name="' + row.leave_type_name + '" value="' + row.days + '">';
                    }},
            ]
        });

        $("#generateReport").click(function () {
            var data = studentReport.rows().data();
            var matches = [];
            var checkboxes = studentReport.$('input[type="checkbox"]');
            for (var i =0; i < checkboxes.length; i++) {
                if(checkboxes[i].checked) {
                    matches.push(checkboxes[i].value);
                }
                if ( i === (checkboxes.length - 1)) {
                    $('#genSreport').val(JSON.stringify(matches));
                    $('#genSreport').click();
                }

            }
        });

        $("#saveLeave").click(function () {
            var data = leaveTypes.rows().data();
            var array = data.data();
            var matches = [];
            var final = [];
            var checkboxes = leaveTypes.$('input[type="checkbox"]');
            var testBox  =  leaveTypes.$('input[type="text"]');
            for (var i =0; i < checkboxes.length; i++) {
                var res = $.grep(array, function(e){ return e.leave_type_id == checkboxes[i].value });
                if(checkboxes[i].checked) {
                    matches.push(res[0]);
                }
                if ( i === (checkboxes.length - 1)) {
                    for(var j=0; j < testBox.length; j++) {
                        var res = $.grep(matches, function(e){ return e.leave_type_id == $(testBox[j]).data('id') });
                        if(res.length > 0) {
                            res[0].days = $(testBox[j]).val();
                            final.push(res[0])
                        }
                        if ( j === (testBox.length - 1)) {
                            $('#leaveAssign').val(JSON.stringify(final));
                            $('#leaveAssign').click();
                        }

                    }
                }
            }
        });

        $('#example-select-all').on('click', function(){
            // Get all rows with search applied
            var rows = leaveTypes.rows({ 'search': 'applied' }).nodes();
            // Check/uncheck checkboxes for all rows in the table
            $('input[type="checkbox"]', rows).prop('checked', this.checked);
        });

        $('#student-select-all').on('click', function(){
            // Get all rows with search applied
            var rows = studentReport.rows({ 'search': 'applied' }).nodes();
            // Check/uncheck checkboxes for all rows in the table
            $('input[type="checkbox"]', rows).prop('checked', this.checked);
        });

        var notificationLogs = $('.notification-logs').DataTable({
            "processing": true,
            "serverSide": true,
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }

            },"columnDefs": [ {
                "targets": 3,
                "searchable": false
            } ],
            "order": [[ 0, "asc" ]],
            columns: [
                {data: "first_name", "orderable":"true"},
                {data: "primary_phone"},
                {data: "updated_date"},
                {data: "message"},
                {data: '',
                    render: function ( data, type, row, meta) {
                        return "<a id="+row.id+" class='logStatus'><i class='fa fa-eye fa-lg'></i></a>";
                    }
                }
            ],
            "bDestroy": true
        });

        $('.notification-logs tbody').on('click', 'a.logStatus', function () {
            var data = notificationLogs.row($(this).parents('tr')).data();
            if(data != undefined){
                $('#checkStatus').val(JSON.stringify(data));
                $('#checkStatus').click();
            }
        });

        var respond = $('.datatable-respond-leaves').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 2]
                }],
            columns: [
                {data: "requestedDate"},
                {data: "",
                    render: function (data, type, row) {
                        return row.fromDate + ' - ' + row.toDate;
                    },
                },
                {data: "leaveReason"},
                {data: "updatedDate"},
            ]
        });

        var rank_report = $('.rank-details').DataTable({
            destroy: true,
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,
            columns: [
                {data: "user_name", "orderable": "true"},
                {data: "first_name"},
                {data: "marks_obtained"},
                {data: 'total_percentage'},
                {data: 'total_grade_name'},
                {data: 'total_cgpa_value'}
            ]
        });

        var publishHallOfFame = $('.datatable-publish-hall-of-fame').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 2]
                }],
            columns: [
                {data: "first_name"},
                {data: "class_name"},
                {data: "section_name"}
            ]
        });


        function validateAttendanceData(data) {
            var body = $.parseJSON( data );

            if(body.success) {
                if(body.data.message != undefined) {
                    showNotification(body.data.message, '', 'bg-danger');
                }
            }
            if(body != null && body != 'undefined') {
                if(body.validSession != null && body.validSession != 'undefined' && !body.validSession) {
                    $('#logoutId').click()
                    body.data = []
                    return JSON.stringify(body);
                }
            }
            if(!body.success) {
                console.log('datatable err', body)
                showInformation('top', 'Error in Loading this Page, Please Contact Admin.', 'error');
                body.data = []
                return JSON.stringify(body);
            }
            return data;
        }


        // External table additions
        // ------------------------------

        // Add placeholder to the datatable filter option
        $('.dataTables_filter input[type=search]').attr('placeholder', 'Type to Search...');


        // Enable Select2 select for the length option
        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });

    });
}
function showError(msg) {
    swal({
        title: "Oops...",
        text: msg,
        confirmButtonColor: "#EF5350",
        type: "error"
    });
}

$(document).on('click', 'body .confirm', function () {
    $('#deleteChildButton').click();
});
$(document).on('click', 'body .cancel', function () {
    $('#deleteChildButton').val('');
});

$(document).on('click', 'body .confirm', function () {
    $('#deleteSubChildButton').click();
});
$(document).on('click', 'body .cancel', function () {
    $('#deleteSubChildButton').val('');
});
