/**
 * Created by Sai Deepak on 09-Mar-17.
 */
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
function enableDataTableAjax(url, body, headers) {

    $(function () {


        // Table setup
        // ------------------------------
        enabledataBtn()

        var leaveAssign = $('.datatable-leave-assign').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }

            },
            "processing": true,
            columnDefs: [{
                targets: 5,
                data: '',
                render: function ( data, type, row, meta) {
                    var returnData = "";
                    if(row.editPermissions && isCurrentYear()) {
                        returnData = "<a class='icon-primary ' id='editAssignLeave'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='deleteAssignLeave' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                    } else {
                        returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                    }

                    return returnData;
                }
            }, {
                targets: 0,
                data: "emp_username"
            }, {
                targets: 1,
                data: "reporting_emp_username"
            }, {
                targets: 2,
                data: function (row, type, val, meta) {
                    var departments = body.departments;
                    var filterDepts = departments.filter(function (el) {
                        return (el.dept_id == row.dept_id)
                    });
                    return filterDepts[0].dept_name;
                }
            }, {
                targets: 3,
                data: "leave_type_name"
            },{
                targets: 4,
                data: "no_of_leaves"
            }]
        });

        $('.datatable-leave-assign tbody').on('click', 'a#deleteAssignLeave', function () {
            var data = leaveAssign.row($(this).parents('tr')).data();
            $('#deleteLeave').val(JSON.stringify(data));
            $('#deleteLeave').click();
        });

        $('.datatable-leave-assign tbody').on('click', 'a#editAssignLeave', function () {
            var rowData = leaveAssign.row($(this).parents('tr')).data();
            if(rowData != undefined){
                $('#editLeave').attr('data-title','Edit Leave');
                $('#editLeave').val(rowData.id);
                $('#editLeave').click();
            }
        });


        //Assignment Datatables

        var assignments = $('.datatable-assignment-export').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                },
                data: function ( d ) {
                    d['classId']= body.classId;
                    d['sectionId']= body.sectionId;
                    d['subjectId']= body.subjectId;
                    d['startDate']= body.startDate;
                    d['endDate']= body.endDate;
                    return JSON.stringify(d);
                },
                type: 'post'
            },
            "processing": true,
            "serverSide": true,
            "autoWidth" : false,
            columnDefs: [
                { "sWidth": "15%", "sClass": "right" ,targets:0},
                { "sWidth": "15%", "sClass": "right" ,targets:1},
                {
                    targets: [0, 7]
                }],
            order: [4, 'desc'],
            columns: [
                {data: "assignmentName"},
                {data: "subjectName"},
                {data: "dueDate"},
                {data: "updatedUserName"},
                {data: "updatedDate"},
                {data: "",
                    render: function ( data, type, row ) {
                        var returnData = "<span class='label listSarcheAssignment_status'></span>"
                        return returnData;
                    }},
                {data:"",
                    render: function ( data, type, row, meta) {
                        return "<a class='icon-primary' id='notifiedLog'><i class='icomoon-custom-size icon-file-eye' title='Logs'></i></a>";
                    }},
                {
                    data: "",
                    render: function (data, type, row) {
                        var returnData = "";
                        if(row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary ' id='assignmentEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-primary ' id='assignmentView'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-primary' id='assignCloneFee'><i class='fa fa-copy fa-lg' title='Clone'></i></a>&nbsp;<a id='assignmentDelete'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>";
                        } else {
                            returnData = "<a class='icon-default ' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-primary ' id='assignmentView'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-copy fa-lg' title='Clone'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>";
                        }

                        return returnData;
                    },
                }


            ],
            rowCallback: function (row, data) {
                if (data.status === "Draft") {
                    $(row).find(".listSarcheAssignment_status").removeClass('label-success').addClass('label-warning').text('Draft');
                } else {
                    $(row).find(".listSarcheAssignment_status").removeClass('label-warning').addClass('label-success').text('Published');
                }
            }
        });

        $('.datatable-assignment-export tbody').on('click', 'a#notifiedLog', function () {
            var data = assignments.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#notificationLogs').val(JSON.stringify(data));
                $('#notificationLogs').click();
            }
        });

        $('.datatable-assignment-export tbody').on('click', 'a#assignmentDelete', function () {
            var data = assignments.row($(this).parents('tr')).data();
            if(data != undefined) {
                if(data.status == 'Published') {
                    $('#deleteButton').val('');
                    showError("You cannot delete a published Homework");
                } else {
                    $('#deleteButton').val(JSON.stringify(data));
                    $('#assignmentsWarning').click();
                }
            }
        });

        $('.datatable-assignment-export tbody').on('click', 'a#assignmentEdit', function () {
            var data = assignments.row($(this).parents('tr')).data();
            if(data != undefined) {
                if(data.status == 'Published') {
                    showNotification("Sorry! You cannot edit a published Homework", "", "bg-danger");
                } else {
                    $('#assignmentsEdit').val(data.id);
                    $('#assignmentsEdit').attr('data-title', 'Edit Homework ');
                    $('#assignmentsEdit').click();
                }
            }
        });

        $('.datatable-assignment-export tbody').on('click', 'a#assignCloneFee', function () {
            var data = assignments.row($(this).parents('tr')).data();
            if(data != undefined) {
                $('#assignmentsCloneFee').val(data.id);
                $('#assignmentsCloneFee').attr('data-title', 'Clone Homework');
                $('#assignmentsCloneFee').click();
            }
        });

        $('.datatable-assignment-export tbody').on('click', 'a#assignmentView', function () {
            var data = assignments.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#assignmentsView').val(JSON.stringify(data));
                $('#assignmentsView').attr('data-title', 'Assignment Details');
                $('#assignmentsView').click();
            }
        });



        var feeDetails = $('table.datatable-fee-details').DataTable({
            ajax: {
                url: url,
                headers: headers,dataFilter: function(data){
                    return validateData(data);
                }

            },
            initComplete: function( settings, json ) {
                $('#checkRole').trigger('click')
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 7, 8, 9]
                },
                {"className": "dt-center", "targets": [8, 9]}
            ],
            columns: [
                {data: "firstName"},
                {data: "className"},
                {data: "sectionName"},
                {data: "totalScholarshipAmount"},
                {data: "feeDiscountAmount"},
                {data: "netAmount"},
                {data: "paidAmount"},
                {data: '',
                    render: function ( data, type, row ) {
                        return "<span class='label fee_status'></span>"
                    }},
                {data: '',
                    render: function ( data, type, row ) {
                        if (isCurrentYear()) {
                            return  row.isPaid == 'Paid' || row.status != 'Published' ? "<a>-</a>" : "<button class='btn btn-primary btn-xs' id='payByCash'>Cash</button>"
                        } else {
                            return "<button class='btn btn-primary btn-xs' disabled='disabled'>Cash</button>"
                        }

                    }},
                {data: '',
                    render: function ( data, type, row ) {
                        return "<a class='icon-primary' id='printReceipt'><i class='icon-printer'></i></a>"
                    }}
            ],rowCallback: function (row, data) {
                if (data.isPaid == "Paid") {
                    $(row).find(".fee_status").removeClass('label-danger').addClass('label-success').text('Paid');
                    $(row).find("#payByCash").addClass('not-active');
                } else {
                    $(row).find(".fee_status").removeClass('label-success ').addClass('label-danger').text('UnPaid');
                }
            }
        });

        $('.datatable-fee-details tbody').on('click', 'button#payByCash', function () {
            var data = feeDetails.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#payByCashObj').val(JSON.stringify(data));
                $('#payByCashWarning').val(JSON.stringify(data)).click();
            }

        });

        $('.datatable-fee-details tbody').on('click', '#printReceipt', function () {
            var data = feeDetails.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#requestDownload').val(JSON.stringify(data)).click();
            }

        });


        var editAttendance = $('.datatable-edit-attendance').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            "processing": true,
            "pageLength": 100,
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
                    var returnData = '<input type="checkbox" name="id[]" ' + checked + '  value="' + row.userName +'">';
                    return returnData;
                }
            },
                {
                    targets: 3,
                    'render': function (data, type, row){

                        return '<input type="text" class="form-control" data-id="' + row.userName + '" value="' + row.remarks + '">';
                    }
                },
                {
                    orderable: false,
                    targets: [0, 2]
                }],
            order: [1, 'asc'],
            columns: [
                {data: "admissionNo"},
                {data: "firstName"},
            ],
        });

        $("#editAttendance").click(function () {
            var data = editAttendance.rows().data();
            var array = data.data();
            var matches = [];
            var final = [];
            var checkboxes = editAttendance.$('input[type="checkbox"]');
            var testBox  =  editAttendance.$('input[type="text"]');
            for (var i =0; i < checkboxes.length; i++) {
                var classObj = {};
                var classes = [];
                var res = $.grep(array, function(e){ return e.userName == checkboxes[i].value });
                res[0].isPresent = checkboxes[i].checked;
                classObj['class_id'] = res[0].classId;
                classObj['class_name'] = res[0].className;
                classObj['section_id'] = res[0].sectionId;
                classObj['section_name'] = res[0].sectionName;
                classes.push(classObj);
                res[0]['classes'] = classes;
                matches.push(res[0]);

                if ( i === (checkboxes.length - 1)) {
                    for(var j=0; j < testBox.length; j++) {
                        var res = $.grep(matches, function(e){ return e.userName == $(testBox[j]).data('id') });
                        res[0].remarks = $(testBox[j]).val();
                        final.push(res[0])
                        if ( j === (testBox.length - 1)) {
                            if (final != undefined && final.length > 0) {
                                $('#editAtdnce').val(JSON.stringify(final));
                                $('#editAtdnce').click();
                            }
                        }
                    }
                }
            }
        });

        var examSchedule = $('.datatable-exam-schedule').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }

            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "written_exam_name", "orderable":"true"},
                {data: "class_name", "orderable":"true"},
                {data: "updatedDate"},
                {data: "updatedUsername"},
                {data: '', render: function ( data, type, row, meta) {
                    if (row.status) {
                        return "<span class='label section_status label-success'>Published</span>";
                    } else {
                        return "<span class='label section_status label-warning'>Draft</span>";
                    }
                }},
                {data: '',
                    render: function ( data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='editExam'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-primary' id='examClone'><i class='fa fa-copy fa-lg' title='Clone'></i></a>&nbsp;<a id='delExam'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-copy fa-lg' title='Clone'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }
                        return returnData;
                    }},
            ]
        });

        $('.datatable-exam-schedule tbody').on('click', 'a#delExam', function () {
            var data = examSchedule.row($(this).parents('tr')).data();
            if (data != undefined) {
                if (data.status) {
                    $('#confirmSubmit,#deleteButton').val('');
                    showError("You cannot delete a published Exam Schedule");
                } else {
                    $('#deleteButton').val('');
                    $('#confirmSubmit').val(data.exam_schedule_id);
                    $('#warningExam').click();
                }
            }
        });

        $('.datatable-exam-schedule tbody').on('click', 'a#editExam', function () {
            var data = examSchedule.row($(this).parents('tr')).data();
            if (data != undefined) {
                /*if (data.status) {
                 $('#confirmSubmit,#deleteButton').val('');
                 showError("You cannot edit a published Exam Schedule");
                 } else {*/
                $('#confirmSubmit,#deleteButton').val('');
                $('#updateExam').attr('data-title', 'Edit Exam Schedule');
                $('#updateExam').val(JSON.stringify({id: data.exam_schedule_id, click: 'edit'}));
                $('#updateExam').click();
                // }
            }
        });

        $('.datatable-exam-schedule tbody').on('click', 'a#examClone', function () {
            var data = examSchedule.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#updateExam').attr('data-title', 'Clone Exam Schedule ');
                $('#updateExam').val(JSON.stringify({id: data.exam_schedule_id, click: 'clone'}));
                $('#updateExam').click();
            }
        });

        $('.datatable-exam-schedule tbody').on('click', 'a#examView', function () {
            var data = examSchedule.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#updateExam').attr('data-title', 'Exam Schedule - ' + data.written_exam_name);
                $('#updateExam').val(JSON.stringify({id: data.exam_schedule_id, click: 'view'}));
                $('#updateExam').click();
            }
        });


        var empTimetable = $('table.employee-timetable').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function(data){
                    return validateData(data);
                }
            },
            order: [1, 'asc'],
            columnDefs: [ {
                orderable: false,
                targets: [0, 5]
            }
            ],
            columns: [
                {data: "user_name"},
                {data: "first_name"},
                {data: "short_name"},
                {data: "user_code"},
                {data: "noOfPeriods"},
                {data: '',
                    render: function ( data, type, row, meta) {
                        return "<a class='icon-primary' id='viewEmpTimetable'><i class='fa fa-eye fa-lg' title='View'></i></a>"
                    }},
            ]
        });

        $('.employee-timetable tbody').on('click', 'a#viewEmpTimetable', function () {
            var data = empTimetable.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#viewButton').attr('data-title', 'Employee Name - ' + data.first_name);
                $('#viewButton').val(JSON.stringify(data));
                $('#viewButton').click();
            }
        });

        $('.exam-details tbody').on('click', 'a#showStatistics', function () {
            //  $('#viewTimetable').click();
        });

        var approval = $('.datatable-approval-history').DataTable({
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
                {data: "empId"},
                {data: "empName"},
                {data: "",
                    render: function (data, type, row) {
                        return row.fromDate + ' - ' + row.toDate;
                    },
                },
                {data: "updatedDate"},
            ]
        });

        var notifications = $('.datatable-my-notifications').DataTable({
            ajax: {
                url: url,
                headers: headers,
                /*dataFilter: function(data){
                 return validateData(data);
                 }*/
            },
            "processing": true,
            "serverSide": true,
            lengthMenu: [ [ 10, 25, 50, 100, 10000 ],  [ '10', '25', '50', '100', 'All' ]],
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a id='edit' class='icon-primary'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;&nbsp;<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>&nbsp;&nbsp;<!--<button id='view' class='btn border-green text-green'><i class='fa fa-eye fa-lg' title='View'></i></button>-->"
             },*/

                { "sWidth": "25%", "sClass": "right" ,targets:1},
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            order: [3, 'desc'],
            columns: [
                {data: "title", "orderable":"true"},
                {data: "message"},
                {data: '',
                    render: function(data, type, row, meta){
                        var returnData;
                        if(row.attachments.length < 1 ){
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-paperclip fa-lg'></i></a>"
                        }else{
                            returnData = "<a class='icon-primary' id='downloadNotes' (click)='downloadNotes($event)'><i class='fa fa-paperclip fa-lg'></i></a>"
                        }
                        return returnData;
                    }},
                {data: '',
                    render: function ( data, type, row ) {
                        return "<span class='label notification_status'></span>"
                    }},
                {data: '',
                    render: function ( data, type, row ) {
                        var status = row.updated_username + ' - ' + row.updated_date;
                        return status
                    },
                },

            ],
            rowCallback: function (row, data) {
                if (data.status == "Sent") {
                    $(row).find(".notification_status").removeClass('label-warning').addClass('label-success').text(data.status);
                } else {
                    $(row).find(".notification_status").removeClass('label-success').addClass('label-warning').text(data.status);
                }
            }
        });

        $('.datatable-my-notifications').on('click', 'a#downloadNotes', function () {
            var data = notifications.row($(this).parents('tr')).data();
            $('#downloadAttach').val(JSON.stringify(data));
            $('#downloadAttach').click();
        });

        var routes = $('.datatable-routes').DataTable({
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
                {
                    orderable: false,
                    targets: [0, 4]
                }],
            columns: [
                {data: "route_name", "orderable":"true"},
                {data: "", data: function (row, type, val, meta) {
                    var filterDrivers = body.filter(function (el) {
                        return (el.id == row.driver_id)
                    });
                    return filterDrivers[0].driver_name;
                }},
                {data: "reg_no"},
                {data: "orgin"},
                {data: "destination"},
                {data: '',
                    render: function ( data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }
                        return returnData;
                    }},
            ]
        });

        $('.datatable-routes tbody').on('click', 'a#edit', function () {
            var data = routes.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#editRoute').attr('data-title', 'Edit Route Details ');
                $('#editRoute').val(data.id);
                $('#editRoute').click();
            }

        });

        $('.datatable-routes tbody').on('click', 'a#del', function () {
            var data = routes.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(data.id);
                $('#deleteWarning').click();
            }

        });

        var audios = $('.datatable-audios').DataTable({
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
                {data: "name", orderable: true},
                {data: '',
                    render: function ( data, type, row) {
                        return row.updated_username + ' - ' + row.updated_date;
                    }
                },
                {data: '',
                    render: function ( data, type, row ) {
                        var url = body+ '/' + row.download_link;
                        return "<audio controls src ='" + url + "'></audio>"
                    }},
                {data: '',
                    render: function ( data, type, row ) {
                        return "<span class='label audio_status'></span>"
                    }},

            ],
            rowCallback: function (row, data) {
                if (data.status == "initiated") {
                    $(row).find(".audio_status").removeClass('label-success').addClass('label-warning').text(data.status);
                } else {
                    $(row).find(".audio_status").removeClass('label-warning').addClass('label-success').text(data.status);
                }
            }
        });


        var viewHallOfFame = $('.datatable-view-hall-of-fame').DataTable({
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
                {data: "section_name"},
                {data: '',
                    render: function ( data, type, row ) {
                        return "<span class='label hallOfFame_status'></span>"
                    }},
            ],
            rowCallback: function (row, data) {
                if (data.status == true) {
                    $(row).find(".hallOfFame_status").removeClass('label-warning').addClass('label-success').text('Published');
                } else {
                    $(row).find(".hallOfFame_status").removeClass('label-success').addClass('label-warning').text('Pending');
                }
            }
        });



        if(body != null && body.classes != undefined) {
            var studentReport = $('.datatable-student-report').DataTable({
                ajax: {
                    url: url,
                    headers: headers,
                    dataFilter: function(data){
                        return validateData(data);
                    },
                    data: function ( d ) {
                        d['classes']= body.classes;
                        d['year']= body.year;
                        d['promoted']= body.promoted;
                        return JSON.stringify(d);
                    },
                    type: 'post'
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
                    {data: "user_code", "orderable":"true"},
                    {data: "first_name"},
                    {data: "primary_phone"},
                ]
            });

        } else {
            var studnetView = $('.datatable-depromote-list').DataTable({
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
                        targets: [0, 3]
                    }],
                order: [1, 'asc'],
                columns: [
                    {data: "user_name","orderable":"true"},
                    {data: "first_name"},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            return (row.classes[0].class_name + ' - ' + row.classes[0].section_name);
                        }},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            var $select = $("<select></select>", {
                                "id": row.user_name,
                                "value": data != undefined ? data.section_id : ""
                            });
                            $.each(body.sections, function(k,v){
                                var $option = $("<option></option>", {
                                    "text": v.section_name,
                                    "value": JSON.stringify(v),
                                });
                                /*if(d === v){
                                 $option.attr("selected", "selected")
                                 }*/
                                $select.append($option);
                            });
                            return body.promoted_class_name + '&nbsp;&nbsp;' + $select.prop("outerHTML");

                        }},
                    {data: '', "orderable":"true",
                        render: function ( data, type, row ) {
                            return '<input type="button" class="btn btn-success btn-sm promoteBtn" value="Promote">';
                        }},
                ],
            });

            $('.datatable-depromote-list tbody').on('click', 'input.promoteBtn', function () {
                var data = studnetView.row($(this).parents('tr')).data();
                if(data != undefined) {
                    var section = JSON.parse($('#' + data.user_name).val());
                    var data1 = jQuery.extend(true, {}, data);
                    var user = {};
                    var existingClass = {};
                    data.preClasses = data1.classes;
                    data.newClassId =  body.promoted_class_id;
                    data.oldClassId = body.class_id;
                    data.newSectionId = section.section_id;
                    data.classes[0].class_id = body.promoted_class_id;
                    data.classes[0].class_name = body.promoted_class_name;
                    data.classes[0].class_code = body.classObj['classCode'];
                    data.classes[0].section_id = section.section_id;
                    data.classes[0].section_name = section.section_name;
                    data.classes[0].section_code = section.section_code;
                    user['users'] = [data];
                    user['userName'] = data.user_name;
                    user['academicYear'] = body.new_academic_year;
                    existingClass.id = body.class_id;
                    user['existingClass'] = [existingClass];
                    user['year'] = body.academic_year;
                    if (data != undefined) {
                        $('#depromoteSave').val(JSON.stringify(user));
                        $('#depromoteSave').click();
                    }
                }

            });
        }

        $('#student-select-all').on('click', function(){
            // Get all rows with search applied
            var rows = studentReport.rows({ 'search': 'applied' }).nodes();
            // Check/uncheck checkboxes for all rows in the table
            $('input[type="checkbox"]', rows).prop('checked', this.checked);
        });

        $("#genPromoReport").click(function () {
            var data = studentReport.rows().data();
            var matches = [];
            var checkboxes = studentReport.$('input[type="checkbox"]');
            for (var i =0; i < checkboxes.length; i++) {
                if(checkboxes[i].checked) {
                    matches.push(checkboxes[i].value);
                }
                if ( i === (checkboxes.length - 1)) {
                    $('#genreport').val(JSON.stringify(matches));
                    $('#genreport').click();
                }

            }
        });


        // External table additions
        // ------------------------------

        // Add placeholder to the datatable filter option
        //$('.dataTables_filter input[type=search]').attr('placeholder', 'Type to filter...');


        // Enable Select2 select for the length option
        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });

    });

    function buildSearchData(body){
        var obj = {"classId": body.classId,
            "sectionId": body.sectionId,
            "subjectId": body.subjectId};
        return obj;
    }


}

function initializeAudioControls(){
    document.addEventListener('play', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].load();
            }
        }
    }, true);
}