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
var assignStudents;
function enableDataTable(url, headers) {

    $(function () {


        // Table setup
        // ------------------------------

        // Setting datatable defaults
        enabledataBtn()

        $.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) {
            // console.log('datatable Error', message);
            showInformation('top', 'Error in Loading this Page', 'error');
        };

        // Column selectors
        $('.datatable-export').DataTable({});

        var mmm = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var notifications = $('.datatable-nested').DataTable({
            "processing": true,
            "serverSide": true,
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            lengthMenu: [ [ 10, 25, 50, 100, 10000 ],  [ '10', '25', '50', '100', 'All' ]],
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a id='edit' class='icon-primary'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;&nbsp;<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>&nbsp;&nbsp;<!--<button id='view' class='btn border-green text-green'><i class='fa fa-eye fa-lg' title='View'></i></button>-->"
             },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            order: [3, 'desc'],
            columns: [
                {data: "title", "orderable": "true"},
                {data: "count"},
                {
                    data: '',
                    render: function (data, type, row) {
                        return "<span class='label notification_status'></span>"
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var date = new Date(row.updated_date), sAMPM = "AM";
                        var sHour = date.getHours();
                        var iHourCheck = parseInt(date.getHours());

                        if (iHourCheck > 12) {
                            sAMPM = "PM";
                            sHour = iHourCheck - 12;
                        }

                        var formattedDate = mmm[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear()
                            + ' ' + sHour + ':' + date.getMinutes() + ' ' + sAMPM;
                        return row.updated_username + ' - ' + moment(formattedDate).format('LLL');
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.media_status == 'Progress' && row.status == 'Sent') {
                            returnData = "<a id='sendsms' class='icon-primary'><i class='glyphicon glyphicon-share fa-lg'></i></a>&nbsp;&nbsp;"
                        }
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = returnData + "<a id='edit' class='icon-primary'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;&nbsp;<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>&nbsp;&nbsp;<!--<button id='view' class='btn border-green text-green'><i class='fa fa-eye fa-lg' title='View'></i></button>-->"
                        } else {
                            returnData = returnData + "<a class='icon-primary'  id='edit' ><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                }
            ],
            rowCallback: function (row, data) {
                if (data.status == "Sent" || data.status == "sent") {
                    $(row).find(".notification_status").removeClass('label-warning').addClass('label-success').text(data.status);
                } else {
                    $(row).find(".notification_status").removeClass('label-success').addClass('label-warning').text(data.status);
                }
            }

        });

        $('.datatable-nested tbody').on('click', 'a#del', function () {
            var data = notifications.row($(this).parents('tr')).data();

            if (data) {
                if (data.status == "Sent") {
                    $('#deleteButton').val('');
                    showError("You Can't delete the message!");
                } else {
                    $('#deleteButton').val(JSON.stringify(data));
                    $("#deleteButton").text(data.status);
                    $('#warningButton').click();
                }
            }
        });

        $('.datatable-nested tbody').on('click', 'a#sendsms', function () {
            var data = notifications.row($(this).parents('tr')).data();
            if (data) {
                $('#sendButton').val(JSON.stringify(data));
                $('#sendButton').click();
            }
        });

        $('.datatable-nested tbody').on('click', 'a#edit', function () {
            var data = notifications.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#editButton').val(JSON.stringify(data));
                $('#editButton').attr('data-title', 'Update Notifications');
                $('#editButton').click();
            }
        });
        $('.datatable-nested tbody').on('click', 'button#view', function () {
            var data = notifications.row($(this).parents('tr')).data();
            $('#viewButton').val(data.notification_id);
            $('#viewButton').click();

        });


        var voice = $('.datatable-voice').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a id='edit' class='icon-primary'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;&nbsp;<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>&nbsp;&nbsp;<!--<button id='view' class='btn border-green text-green'><i class='fa fa-eye fa-lg' title='View'></i></button>-->"
             },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            order: [3, 'desc'],
            columns: [
                {data: "title", "orderable": "true"},
                {data: "schedule_date", "orderable": "true"},
                {data: "count"},
                {
                    data: '',
                    render: function (data, type, row) {
                        return "<span class='label notification_status'></span>"
                    }
                },
                {data: "updateddateAndName"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a id='edit' class='icon-primary'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;&nbsp;<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>&nbsp;&nbsp;<!--<button id='view' class='btn border-green text-green'><i class='fa fa-eye fa-lg' title='View'></i></button>-->"
                        } else {
                            returnData = "<a class='icon-primary'  id='edit' ><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                }
            ],
            rowCallback: function (row, data) {
                if (data.status == "Sent" || data.status == "sent") {
                    $(row).find(".notification_status").removeClass('label-warning').addClass('label-success').text(data.status);
                } else {
                    $(row).find(".notification_status").removeClass('label-success').addClass('label-warning').text(data.status);
                }
            }

        });

        $('.datatable-voice tbody').on('click', 'a#del', function () {
            var data = voice.row($(this).parents('tr')).data();
            if (data.status == "Sent") {
                $('#deleteButton').val('');
                showError("You Can't delete the message!");
            } else {
                $('#deleteButton').val(JSON.stringify(data));
                $("#deleteButton").text(data.status);
                $('#warningButton').click();
            }

        });

        $('.datatable-voice tbody').on('click', 'a#edit', function () {
            var data = voice.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#editDriver').val(JSON.stringify(data));
                $('#editDriver').attr('data-title', 'Update Notifications');
                $('#editDriver').click();
            }
        });

        $('.datatable-voice tbody').on('click', 'button#view', function () {
            var data = voice.row($(this).parents('tr')).data();
            $('#viewButton').val(data.notification_id);
            $('#viewButton').click();

        });


        // Fee Managaement Feature DataTables

        var tableNested = $('.datatable-fee-type').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    targets: [0, 3]
                }],
            "order": [[0, "asc"]],
            columns: [
                {data: "name"},
                {data: "updateddateAndName"},
                {
                    data: '',
                    render: function (data, type, row) {
                        return "<span class='refundable_deposit'></span>"
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary ' id='edit1'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ],
            rowCallback: function (row, data) {
                if (data.feeDeposit == true) {
                    $(row).find('.refundable_deposit').text('Yes');
                } else {
                    $(row).find('.refundable_deposit').text("No");
                }
            }
        });

        $('.datatable-fee-type tbody').on('click', 'a#del', function () {
            var data = tableNested.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#warningButton1').click();
            }

        });

        $('.datatable-fee-type tbody').on('click', 'a#edit1', function () {
            var data = tableNested.row($(this).parents('tr')).data();
            $('#editButton1').val(data.id);
            $('#editButton1').attr('data-title', 'Edit Fee Type ');
            $('#editButton1').click();

        });

        /*section list starts*/
        var sectionList = $('.datatable-sectionList').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    targets: [0, 3],
                    orderable: false

                }],
            order: [1, 'desc'],
            columns: [
                {data: "sectionName", "orderable": "true"},
                {data: "sectionCode"},
                {data: "updatedDateAndName"},
                {
                    data: '',
                    render: function (data, type, row) {
                        return "<span class='label section_status'></span>"
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delww'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ],
            rowCallback: function (row, data) {
                if (data.status == "Active") {
                    $(row).find(".section_status").removeClass('label-warning').addClass('label-success').text('Active');
                } else {
                    $(row).find(".section_status").removeClass('label-success').addClass('label-warning').text('Inactive');
                }
            }
        });

        $('.datatable-sectionList tbody').on('click', 'a#delww', function () {
            var data = sectionList.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#warningSection').click();
                $('#deleteButton').val(JSON.stringify(data));
            }

        });

        $('.datatable-sectionList tbody').on('click', 'a#edit', function () {
            var data = sectionList.row($(this).parents('tr')).data();
            $('#sectionEditButton').val(data.sectionId);
            $('#sectionEditButton').attr('data-title', 'Edit Section');
            $('#sectionEditButton').click();

        });
        /*section list end*/

        var scholarship = $('.datatable-scholarship').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a class='icon-primary' id='edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                {
                    orderable: false,
                    targets: [0, 4]
                }],

            columns: [
                {data: "name", "orderable": "true"},
                {data: "amount"},
                {data: "validUpto"},
                {data: "updateddateAndName"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-scholarship tbody').on('click', 'a#del', function () {
            var data = scholarship.row($(this).parents('tr')).data();
            if (data != undefined) {
                if (data.status == false) {
                    showError("You Can't delete the message!");
                } else {
                    $('#warningfeeSccholar').click();
                    $('#deleteButton').val(JSON.stringify(data));

                }
            }

        });

        /* end section list*/

        /*section allocation starts*/
        var sectionAllocation = $('.datatable-sectionAllocation').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a class='icon-primary' id='edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delww'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                {
                    orderable: false,
                    targets: [0, 4]
                }],
            order: [1, 'desc'],
            columns: [
                {data: "academicYear", "orderable": "true"},
                {data: "className"},
                {data: "sectionName"},
                {data: "studentIntake"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delww'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-sectionAllocation tbody').on('click', 'a#delww', function () {
            var data = sectionAllocation.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#warningSection').click();
                $('#deleteButton').val(JSON.stringify(data));
            }

        });


        $('.datatable-sectionAllocation tbody').on('click', 'a#edit', function () {
            var data = sectionAllocation.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#sectionAllocationEditButton').val(data.id);
                $('#sectionAllocationEditButton').attr('data-title', 'Edit Section Allocation');
                $('#sectionAllocationEditButton').click();

            }

        });

        /*section allocation ends*/

        $('.datatable-scholarship tbody').on('click', 'a#edit', function () {
            var data = scholarship.row($(this).parents('tr')).data();
            if (data.status == false) {
                showError("You Can't delete the message!");
            } else {
                $('#feeScholarEditButton').val(data.id);
                $('#feeScholarEditButton').attr('data-title', 'Edit Fee Scholarship ');

                $('#feeScholarEditButton').click();
            }

        });

        var timetableConfig = $('.datatable-timetable-config').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 5,
             data: null,
             defaultContent: "<a class='icon-primary' id='configEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='TimetableConfig'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },

             {
             targets: 2,
             render: function (data, type, row) {
             return row.school_hours.from + ' - ' + row.school_hours.to;
             },
             },
             {
             targets: 1,
             render: function (data, type, row) {
             return row.working_days[0] + ' - ' + row.working_days[row.working_days.length - 1];
             },
             },
             {
             targets: 3,
             render: function (data, type, row) {
             return (row.school_periods.length - row.school_breaks.length);
             },
             },
             {
             targets: 4,
             render: function (data, type, row) {
             return row.school_breaks.length;
             },
             },*/

                {
                    orderable: false,
                    targets: [0, 5]
                }],
            order: [4, 'desc'],
            columns: [
                {data: "className", "orderable": "true"},
                {
                    data: "",
                    render: function (data, type, row) {
                        return row.dayNames[0] + ' - ' + row.dayNames[row.dayNames.length - 1];
                    },
                },
                {
                    data: "",
                    render: function (data, type, row) {
                        return row.school_hours.from + ' - ' + row.school_hours.to;
                    },
                },
                {
                    data: "",
                    render: function (data, type, row) {
                        return (row.school_periods.length - row.school_breaks.length);
                    },
                },
                {
                    data: "",
                    render: function (data, type, row) {
                        return row.school_breaks.length;
                    },
                },
                {
                    data: "",
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='configEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='timetableConfig'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>";
                        } else {
                            returnData = "<a class='icon-primary' id='configEdit'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    },
                }
            ]
        });

        $('.datatable-timetable-config tbody').on('click', 'a#timetableConfig', function () {
            var data = timetableConfig.row($(this).parents('tr')).data();

            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#structureWarning').click();
            }
        });


        $('.datatable-timetable-config tbody').on('click', 'a#configEdit', function () {
            var data = timetableConfig.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#configEditButton').val(JSON.stringify(data));
                $('#configEditButton').attr('data-title', 'Edit Timetable Configuration');
                $('#configEditButton').click();
            }
        });


        var feePayAssignedUsers = $('.datatable-fee-pay').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 6,
             /!*data: null,
             defaultContent: "<a id='open' ><button class='btn btn-primary' data-toggle='modal' data-target='#payment'>Pay</button></a>"*!/
             render: function ( data, type, obj, meta ) {
             return obj.isPaid == 'Paid'? "<a id='download'>Download Reciept</a>": "<a id='open' ><button class='btn btn-primary' data-toggle='modal' data-target='#payment'>Pay</button></a>";
             }
             },*/
                {
                    orderable: false,
                    targets: [0, 6, 7]
                },
                {"className": "dt-center", "targets": [6, 7]}],
            order: [4, 'desc'],
            columns: [
                {data: "firstName", "orderable": "true"},
                {data: "termName"},
                {data: "feeAssignmentName"},
                {data: "netAmount"},
                {data: "paidAmount"},
                {data: "dueDate"},
                {data: "isPaid"},
                {
                    data: '',
                    render: function (data, type, row) {
                        return row.isPaid == 'Paid' ? "<a>-</a>" : "<a id='open' ><button class='btn btn-primary'>Pay</button></a>";
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        return "<a id='download'><i class='icon-printer'></i></a>"
                    }
                },
            ]
        });

        $('.datatable-fee-pay tbody').on('click', 'a#open', function () {
            var data = feePayAssignedUsers.row($(this).parents('tr')).data();
            if (data.status == false) {
                showError("You Can't delete the message!");
            } else {
                $('#payButton').val(data.feeAssignmentDetailId);
                $('#payButton').click();
                $('#warningButtonScholarship').click();
            }

        });
        $('.datatable-fee-pay tbody').on('click', 'a#download', function () {
            var data = feePayAssignedUsers.row($(this).parents('tr')).data();
            $('#download').val(JSON.stringify(data));
            $('#download').click();
        });


        /*$('.datatable-fee-pay tbody').on('click', 'button#edit', function () {
         var data = feePayAssignedUsers.row($(this).parents('tr')).data();
         if(data.status == false) {
         showError("You Can't delete the message!");
         } else {
         $('#editButton').val(data.id);
         $('#editButton').click();
         $('#warningButton').click();
         }

         });*/


        /* $(document).on('click','body .confirm',function(){
         $('#deleteButton1').click();
         });
         $(document).on('click','body .cancel',function(){
         $('#deleteButton1').val('');
         });*/

        var tableNested1 = $('.datatable-structure-export').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            "bAutoWidth": false,
            columnDefs: [
                {"sWidth": "17%", "sClass": "center", targets: 0},
                {"sWidth": "17%", "sClass": "center", targets: 1},
                {
                    orderable: false,
                    targets: [0, 5]
                }],
            order: [],
            columns: [
                {data: "feeStructureName", "orderable": "true"},
                {data: "feeStructureDesc"},
                {data: "updatedUsername"},
                {data: "updatedDate"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "<span class='label feeStructure_status'></span>"
                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary ' id='structureEdit1'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='structureDelete1'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ],
            rowCallback: function (row, data) {
                if (data.status == "Active") {
                    $(row).find(".feeStructure_status").removeClass('label-warning').addClass('label-success').text('Active');
                } else {
                    $(row).find(".feeStructure_status").removeClass('label-success').addClass('label-warning').text('inactive');
                }
            }
        });

        $('.datatable-structure-export tbody').on('click', 'a#structureDelete1', function () {
            var data = tableNested1.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#structureWarning').click();
            }
        });

        $('.datatable-structure-export tbody').on('click', 'a#structureEdit1', function () {
            var data = tableNested1.row($(this).parents('tr')).data();
            $('#structureEdit').val(data.feeStructureId);
            $('#structureEdit').attr('data-title', 'Edit Fee Structure ');
            $('#structureEdit').click();

        });


        /*$(document).on('click','body .confirm',function(){
         $('#structureDelete').click();
         });
         $(document).on('click','body .cancel',function(){
         $('#structureDelete').val('');
         });*/

        var assignFee = $('.datatable-fee-export').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                /* {
                 targets: 4,
                 defaultContent: "<span class='label fee_status'></span>"
                 },
                 {
                 targets: 5,
                 defaultContent: "<a class='icon-primary ' id='feeView1'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-primary ' id='feeEdit1'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='feeDelete1'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                 },
                 {
                 targets: 6,
                 defaultContent: "<a class='icon-primary' id='cloneFee'><i class='fa fa-copy fa-lg' title='Clone'></i></a>"
                 },
                 {
                 targets: 7,
                 defaultContent: "<button id='publish' class='btn btn-primary'>Publish</button>"
                 },*/

                {
                    orderable: false,
                    targets: [0, 8]
                }],
            order: [3, 'desc'],
            columns: [
                {data: "updatedDate", "orderable": "true"},
                {data: "feeAssignmentName"},
                {data: "totalFeeAmount"},
                {data: "dueDate"},
                {data: "updatedUsername"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "<span class='label fee_status'></span>"
                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary ' id='feeView1'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-primary ' id='feeEdit1'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='feeDelete1'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-primary ' id='feeView1'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='cloneFee'><i class='fa fa-copy fa-lg' title='Clone'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled' ><i class='fa fa-copy fa-lg' title='Clone'></i></a>"
                        }
                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<button id='publish' class='btn btn-primary'>Publish</button>"
                        } else {
                            returnData = "<button disabled='disabled' class='btn btn-primary'>Publish</button>"
                        }
                        return returnData;
                    }
                },

            ],
            rowCallback: function (row, data) {
                if (data.status == "Pending") {
                    $(row).find(".fee_status").removeClass('label-success').addClass('label-warning').text('Pending');
                } else {
                    $(row).find(".fee_status").removeClass('label-warning').addClass('label-success').text('Published');
                }
            }
        });

        $('.datatable-fee-export tbody').on('click', 'a#feeDelete1', function () {
            var data = assignFee.row($(this).parents('tr')).data();
            if (data != undefined) {
                if (data.status == 'Published') {
                    $('#deleteButton, #payByCashObj').val('');
                    showError("You Can't delete the Assign Fees!");
                } else {
                    $('#deleteButton').val(JSON.stringify(data));
                    $('#feeWarning').click();
                }
            }

        });

        $('.datatable-fee-export tbody').on('click', 'a#feeEdit1', function () {
            var data = assignFee.row($(this).parents('tr')).data();
            if (data.status == 'Published') {
                showNotification("Sorry! You cannot edit a published fee. You can view the log details", "", "bg-danger");
                $('#feeEdit').val('');
            } else {
                $('#feeEdit').attr('data-title', 'Edit Assign Fee');
                $('#feeEdit').val(data.feeAssignmentId);
                $('#savefee').html('Update');
                $('#saveFeeScholarship').html('Update');
                $('#feeEdit').click();
            }


        });

        $('.datatable-fee-export tbody').on('click', 'button#publish', function () {
            var data = assignFee.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#publishDetails').attr('data-title', 'Fee Name - ' + data.feeAssignmentName);
                $('#publishDetails').val(data.feeAssignmentId);
                $('#publishDetails').click()
            }
        });

        $('.datatable-fee-export tbody').on('click', 'a#feeView1', function () {
            var data = assignFee.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#feeView').attr('data-title', 'Fee Name - ' + data.feeAssignmentName);
                $('#feeView').val(data.feeAssignmentId);
                $('#feeView').click();
            }
        });

        $('.datatable-fee-export tbody').on('click', 'a#cloneFee', function () {
            var data = assignFee.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#clone').attr('data-title', 'Clone Fee ');
                $('#clone').val(data.feeAssignmentId);
                $('#savefee').html('Save');
                $('#saveFeeScholarship').html('Save');
                $('#clone').click();
            }

        });

        /* $(document).on('click','body .confirm',function(){
         $('#feeDelete').click();
         });
         $(document).on('click','body .cancel',function(){
         $('#feeDelete').val('');
         });*/

//holidaytypes
        var holiday_types = $('.datatable-holidaytypes').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,

            columnDefs: [/*{
             targets: 3,
             data: null,
             defaultContent: "<a class='icon-primary' id='editholidaytype'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='deleletholidaytype'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/{"sWidth": "30%", "sClass": "right", targets: 1},
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "holidayType", "orderable": "true"},
                {data: "description"},
                {data: "updateddateAndName"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='editholidaytype'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='deleletholidaytype'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a disabled='disabled' class='icon-default'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-holidaytypes tbody').on('click', 'a#deleletholidaytype', function () {
            var data = holiday_types.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#holidayTypeWarning').click();
            }
        });

        $('.datatable-holidaytypes tbody').on('click', 'a#editholidaytype', function () {
            var data = holiday_types.row($(this).parents('tr')).data();
            $('#holidayTypeEdit').val(data.holidayTypeId);
            $('#holidayTypeEdit').attr('data-title', 'Edit Holiday Type');
            $('#holidayTypeEdit').click();

        });


        //Schoolholidaytypes
        var schoolholiday_types = $('.datatable-schoolholidays').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,

            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a class='icon-primary' id='editschoolholidaytype'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='deleletschoolholidaytype'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                {
                    orderable: false,
                    targets: [0, 4]
                }],
            columns: [
                {data: "holidayType", "orderable": "true"},
                {data: "holidayName"},
                {data: "fullDate"},
                {data: "updateddateAndName"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='editschoolholidaytype'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='deleletschoolholidaytype'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a disabled='disabled' class='icon-default'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-schoolholidays tbody').on('click', 'a#deleletschoolholidaytype', function () {
            var data = schoolholiday_types.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#schoolholidayTypeWarning').click();
            }
        });

        $('.datatable-schoolholidays tbody').on('click', 'a#editschoolholidaytype', function () {
            var data = schoolholiday_types.row($(this).parents('tr')).data();
            $('#schoolholidayTypeEdit').val(data.holidayId);
            $('#schoolholidayTypeEdit').attr('data-title', 'Edit Holiday ');
            $('#schoolholidayTypeEdit').click();

        });

//Course Management
        var schoolCourse_Departments = $('.datatable-courseManagement').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            columnDefs: [{
                targets: 2,
                data: function (data) {
                    var output = [];
                    for (var key in data.class) {
                        output.push(data.class[key])
                    }
                    return output.join(' - ');
                }
            }, {
                targets: 3,
                defaultContent: "<span class='label coursedepartment_status'></span>"
            },
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "course_name", "orderable": "true"},
                {data: "course_code"},

            ], rowCallback: function (row, data) {
                if (data.status = true) {
                    $(row).find(".coursedepartment_status").removeClass('label-danger').addClass('label-success').text('Active');
                } else {
                    $(row).find(".coursedepartment_status").removeClass('label-success').addClass('label-danger').text('Inactive');
                }
            }
        });


//subjectList table
        var subject_list = $('.datatable-listsubjects').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
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
                {data: "subName", "orderable": "true"},
                {data: "subCode"},
                {data: "subAspects[,].name"},
                {data: "updateddateAndName"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "<span class='label listsubject_status'></span>"
                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='editsubject'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='deleletSubject'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ], rowCallback: function (row, data) {
                if (data.status == 'Active') {
                    $(row).find(".listsubject_status").removeClass('label-warning').addClass('label-success').text('Active');
                } else {

                    $(row).find(".listsubject_status").removeClass('label-success').addClass('label-warning').text('Inactive');
                }
            }
        });

        $('.datatable-listsubjects tbody').on('click', 'a#deleletSubject', function () {
            var data = subject_list.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#schoolSubjectWarning').click();
            }
        });

        $('.datatable-listsubjects tbody').on('click', 'a#editsubject', function () {
            var data = subject_list.row($(this).parents('tr')).data();
            $('#subjectEdit').attr('data-title', 'Edit Subject ');
            $('#subjectEdit').val(data.subjectId);
            $('#subjectEdit').click();

        });
//classes

        var classes_names = $('.datatable-classes').DataTable({

            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 3,
             data:null,
             defaultContent: "<a id='checkstatus'><input type='checkbox' /><a/>"
             },*/

                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "className", "orderable": "true"},
                {data: "academicYear"},
                {data: "updateddateAndName"},
                {
                    data: '', className: "text-center",
                    render: function (data, type, row) {
                        var activeClass = false;
                        if (row.status) {
                            activeClass = true;
                        }
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<div class='switchery-xs'><a id='checkstatus' class='icon-primary'><label><input type='checkbox' name='switch_single' class='switchery' class-active='" + activeClass + "' switchery-init=false required='required'></label></a>"
                        } else {
                            returnData = "<div class='switchery-xs'><a class='icon-default' disabled='disabled'><label><input type='checkbox' name='switch_single' class='switchery' class-active='" + activeClass + "' switchery-init=false required='required'></label></a>"
                        }

                        return returnData;
                    }
                },
            ],
            "fnDrawCallback": function (oSettings) {
                var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
                elems.forEach(function (html) {
                    if ($(html).attr('switchery-init') == 'false') {
                        if ($(html).attr('class-active') == 'true') {
                            $('.switchery').prop('checked', true);
                            var switchery = new Switchery(html);
                        } else {
                            $('.switchery').prop('checked', false);
                            var switchery = new Switchery(html, {secondaryColor: '#f44336', disabled: true});
                        }
                        $(html).attr('switchery-init', true);
                    }
                });
            }
        });

        $('.datatable-classes tbody').on('click', 'a#checkstatus', function () {
            var data = classes_names.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteClass').val(JSON.stringify(data));
                $('#deleteClass').click();
            }
        });


        var assignament_types = $('.datatable-assignament-types').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a class='icon-primary' id='edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                {"sWidth": "30%", "sClass": "right", targets: 1},
                {
                    orderable: false,
                    targets: [0, 4]
                }],
            columns: [
                {data: "name", "orderable": "true"},
                {data: "desc"},
                {data: "updatedUserName"},
                {data: "updatedDate"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='edit' ><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='asig icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },

            ]
        });

        $('.datatable-assignament-types tbody').on('click', 'a#del', function () {
            var data = assignament_types.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#warningAssignment').click();
            }
        });

        $('.datatable-assignament-types tbody').on('click', 'a#edit', function () {
            var data = assignament_types.row($(this).parents('tr')).data();
            $('#assEditButton').attr('data-title', 'Edit Homework Type');
            $('#assEditButton').val(data.id);
            $('#assEditButton').click();
        });


        /*$(document).on('click','body .confirm',function(){
         $('#AssTypeDelete').click();
         });
         $(document).on('click','body .cancel',function(){
         $('#AssTypeDelete').val('');
         });*/


        //Assignment Datatables

        var assignments = $('.datatable-assignment-export').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            "bAutoWidth": false,
            columnDefs: [
                {"sWidth": "15%", "sClass": "right", targets: 0},
                {"sWidth": "15%", "sClass": "right", targets: 1},
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
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "<span class='label listAssignment_status'></span>"
                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        return "<a class='icon-primary' id='notifiedLog'><i class='icomoon-custom-size icon-file-eye' title='Logs'></i></a>";
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='assignmentEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a><a class='icon-primary ' id='assignmentView'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-primary' id='assignCloneFee'><i class='fa fa-copy fa-lg' title='Clone'></i></a>&nbsp;<a id='assignmentDelete' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a><a class='icon-primary ' id='assignmentView'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a class='icon-default' ><i class='fa fa-copy fa-lg' title='Clone'></i></a>&nbsp;<a class='icon-default'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                }
            ],
            rowCallback: function (row, data) {
                if (data.status == "Draft") {
                    $(row).find(".listAssignment_status").removeClass('label-success').addClass('label-warning').text('Draft');
                } else {
                    $(row).find(".listAssignment_status").removeClass('label-warning').addClass('label-success').text('Published');
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
            if (data != undefined) {
                if (data.status == 'Published') {
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
            if (data != undefined) {
                if (data.status == 'Published') {
                    showNotification("Sorry! You cannot edit a published Homework", "", "bg-danger");
                } else {
                    $('#assignmentsEdit').val(data.id);
                    $('#assignmentsEdit').attr('data-title', 'Edit Homework');
                    $('#assignmentsEdit').click();
                }
            }
        });

        $('.datatable-assignment-export tbody').on('click', 'a#assignmentView', function () {
            var data = assignments.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#assignmentsView').val(JSON.stringify(data));
                $('#assignmentsView').attr('data-title', 'Homework Details');
                $('#assignmentsView').click();
            }
        });

        $('.datatable-assignment-export tbody').on('click', 'a#assignCloneFee', function () {
            var data = assignments.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#assignmentsCloneFee').val(data.id);
                $('#assignmentsCloneFee').attr('data-title', 'Homework Name - ' + data.assignmentName);
                $('#assignmentsCloneFee').click();
            }
        });


        var employees = $('.datatable-employee').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            initComplete: function (settings, json) {
                //$('#checkRoleToResetPwd').trigger('click')
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 6]
                }],
            columns: [
                {data: "userName", "orderable": "true"},
                {data: "firstName"},
                {data: "dept[, ].dept_name"},
                {data: "desg.desg_name"},
                {data: "primaryPhone"},
                {
                    data: '',
                    render: function (data, type, row) {
                        if (row.active) {
                            var status = "Active";
                            return status;
                        } else {
                            var status = "Inactive";
                            return status
                        }
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary pwdReset'><i class='fa fa-repeat fa-lg'></i></a>";
                            /*&nbsp;<a class='icon-primary empDelete'><label><input type='checkbox' name='switch_single' class='switchery' employee-active='" + activeUser + "' switchery-init=false required='required'></label></div></a>*/
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-repeat fa-lg'></i></a>"
                        }

                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var activeUser = false;
                        if (row.active) {
                            activeUser = true;
                        }
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary empEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>";
                            /*&nbsp;<a class='icon-primary empDelete'><label><input type='checkbox' name='switch_single' class='switchery' employee-active='" + activeUser + "' switchery-init=false required='required'></label></div></a>*/
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>"
                        }

                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var activeUser = false;
                        if (row.active) {
                            activeUser = true;
                        }
                        var returnData = "";
                        // console.log("ss", activeUser);
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<div class='switchery-xs'><a class='icon-primary empDelete'><label><input type='checkbox' name='switch_single' class='switchery' employee-active='" + activeUser + "' switchery-init=false required='required'></label></a>"
                        } else {
                            returnData = "<div class='switchery-xs'><a class='icon-default' disabled='disabled'><label><input type='checkbox' name='switch_single' class='switchery' employee-active='" + activeUser + "' switchery-init=false required='required'></label></a>"
                        }

                        return returnData;
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
                elems.forEach(function (html) {
                    if ($(html).attr('switchery-init') == 'false') {
                        if ($(html).attr('employee-active') == 'true') {
                            $('.switchery').prop('checked', true);
                            var switchery = new Switchery(html);
                        } else {
                            $('.switchery').prop('checked', false);
                            var switchery = new Switchery(html, {secondaryColor: '#f44336', disabled: true});
                        }
                        $(html).attr('switchery-init', true);
                    }
                });
            }
        });

        $('.datatable-employee tbody').on('click', 'a.pwdReset', function () {
            var data = employees.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#resetPwd').val(JSON.stringify(data));
                $('#resetWarning').click();
            }
        });

        $('.datatable-employee tbody').on('click', 'a.empDelete', function () {
            var data = employees.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteEmp').val(JSON.stringify(data));
                $('#deleteEmp').click();
            }
        });

        $('.datatable-employee tbody').on('click', 'a.empEdit', function () {
            var data = employees.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#editEmp').val(data.userName);
                $('#editEmp').attr('data-title', 'Edit Employee ');
                $('#editEmp').click();
            }
        });

        var assignStudents = $('.datatable-assign-student').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            processing: false,
            order: [],
            columnDefs: [{
                orderable: false,
                targets: 0,
                render: function (data, type, row) {
                    return '<input type="checkbox" name="id[]" value="' + row.userName + '">';
                }

            }, {
                targets: 1,
                render: function (data, type, row) {
                    return row.userCode;
                }

            }, {
                targets: 2,
                render: function (data, type, row) {
                    return row.firstName;
                }

            }, {
                targets: 3,
                render: function (data, type, row) {
                    return row.classes[0].class_name;
                }

            }, {
                targets: 4,
                render: function (data, type, row) {
                    return row.classes[0].section_name;
                }

            }, {
                orderable: false,
                targets: 5,
                render: function (data, type, row) {
                    return '<input type="text" name="notify_distance[]">';
                }

            }, {
                orderable: false,
                targets: 6,
                render: function (data, type, row) {
                    return '<input type="text" name="pickup_location[]">';
                }
            }]
        });

        //isAllChecked
        $('#select-all').on('click', function () {
            validateAssignee($('#seating-capacity').val() || 0);
        });
        $('.datatable-assign-student').on('change', 'input[type="checkbox"]', function () {
            if (!this.checked) {
                var el = $('#select-all').get(0);
                if (el && el.checked && ('indeterminate' in el)) {
                    el.indeterminate = true;
                }
            }
        });

        $('.datatable-assign-student').on('click', 'input[type="text"]', function () {
            $('#pickup-location').click();
        });


        var studentsTotalLength = 25;
        var students = $('.datatable-student').DataTable({
            "processing": true,
            "serverSide": true,
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    var json = $.parseJSON(data);
                    json.recordsTotal = json.total;
                    studentsTotalLength = json.total;
                    return validateData(data);
                }
            },
            lengthMenu: [[10, 25, 50, 100, 10000], ['10', '25', '50', '100', 'All']],
            initComplete: function (settings, json) {
                //$('#checkRoleToResetPwd').trigger('click')
            },

            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 8]
                }],
            columns: [
                {data: "userCode", "orderable": "true"},
                {data: "userName"},
                {data: "firstName"},
                {data: "classes[0].class_name"},
                {data: "classes[0].section_name"},
                {data: "primaryPhone"},
                {
                    data: '',
                    render: function (data, type, row) {
                        if (row.editPermissions && isCurrentYear()) {
                            if (row.active) {
                                return '<a class="icon-primary studentDelete"><div class="checkbox"><label><div class="checker border-success-600 text-success-800"><span class="checked"><input type="checkbox" class="control-success" checked="checked"></span></div></label></div></a>';
                            } else {
                                return '<a class="icon-primary studentDelete"><div class="checkbox"><label><div class="checker border-danger-600 text-danger-800"><span class="checked"><input type="checkbox" class="control-danger" checked="checked"></span></div></label></div></a>';
                            }
                        } else {
                            if (row.active) {
                                return '<a class="icon-primary studentDelete"><div class="checkbox"><label><div class="checker border-success-600 text-success-800"><span class="checked"><input type="checkbox" class="control-success" checked="checked" disabled="disabled"></span></div></label></div></a>';
                            } else {
                                return '<a class="icon-primary studentDelete"><div class="checkbox"><label><div class="checker border-danger-600 text-danger-800"><span class="checked"><input type="checkbox" class="control-danger" checked="checked" disabled="disabled"></span></div></label></div></a>';
                            }
                        }
                        return row.active + '';
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary pwdReset'><i class='fa fa-repeat fa-lg'></i></a>";
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-repeat fa-lg'></i></a>"
                        }

                        return returnData;
                    }
                },
                {
                    data: '', className: "text-center",
                    render: function (data, type, row) {
                        var activeUser = false;
                        if (row.active) {
                            activeUser = true;
                        }
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary studentEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-primary studentPrint'><i class='icon-printer fa-lg icon-lg'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-primary studentPrint'><i class='icon-printer fa-lg icon-lg'></i></a>"
                        }

                        return returnData;
                    }
                },
            ],
            "fnDrawCallback": function (oSettings) {
                /*var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
                 elems.forEach(function(html) {
                 if ($(html).attr('switchery-init') == 'false') {
                 if ($(html).attr('student-active') == 'true') {
                 $('.switchery').prop('checked', true);
                 var switchery = new Switchery(html);
                 } else {
                 $('.switchery').prop('checked', false);
                 var switchery = new Switchery(html, {secondaryColor: '#f44336', disabled: true});
                 }
                 $(html).attr('switchery-init', true);
                 }
                 });*/
            }
        });

        $('.datatable-student tbody').on('click', 'a.studentDelete', function () {
            var data = students.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteStudent').val(JSON.stringify(data));
                $('#deleteStudent').click();
            }
        });

        $('.datatable-student tbody').on('click', 'a.studentEdit', function () {
            var data = students.row($(this).parents('tr')).data();
            if(data != undefined){
                $('#editStudent').val(JSON.stringify(data));
                $('#editStudent').click();
            }
        });

        $('.datatable-student tbody').on('click', 'a.studentPrint', function () {

            var data = students.row($(this).parents('tr')).data();
            if(data != undefined){
                $('#printStudent').val(data.userName);
                $('#printStudent').click();
            }
        });

        $('.datatable-student tbody').on('click', 'a.pwdReset', function () {
            var data = students.row($(this).parents('tr')).data();
            if(data != undefined){
                $('#resetPwd').val(JSON.stringify(data));
                $('#resetWarning').click();
            }
        });


        /*$(document).on('click','body .confirm',function(){
         $('#assignmentsDelete').click();
         });
         $(document).on('click','body .cancel',function(){
         $('#assignmentsDelete').val('');
         });*/


        var studentsAllocation = $('.datatable-student-allocation').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 7]
                }],
            columns: [
                {
                    data: '',
                    render: function (data, type, row) {
                        var route = $.grep(routes, function (route) {
                            return route.id == row.route_id;
                        })[0];
                        if (route !== undefined) {
                            return "<span title='" + route.route_name + "'>" + route.route_name + "</span>";
                        } else {
                            return "";
                        }
                    }, className: "fc-title", "orderable": "true"
                },
                {data: "reg_no"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var address = JSON.parse(row.pickup_location).location;
                        return "<span title='" + address + "'>" + address + "</span>";
                    }, className: "fc-title"
                },
                {data: "user_code"},
                {data: "first_name"},
                {data: "class_name"},
                {data: "section_name"},

                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-student-allocation tbody').on('click', 'a#del', function () {
            var data = studentsAllocation.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(data.id);
                $('#warningDel').click();
            }
        });


        //Vehicle

        var vehicle = $('.datatable-vehicle').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "reg_no"},
                {data: "vehicle_type"},
                {data: "seating_capacity"},
                {data: "vehicle_fc_date"},

                {
                    data: '',
                    render: function (data, type, row) {

                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary vehicleEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del' class='icon-danger vehicleDelete'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>";
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a disabled='disabled' class='icon-default'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>";
                        }

                        return returnData;
                    }
                },

                {
                    data: '',
                    render: function (data, type, row) {
                        var active = false;
                        if (row.active) {
                            active = true;
                        }
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<div class='switchery-xs'><a class='icon-primary vehicleStatus'><label><input type='checkbox' name='switch_single' class='switchery' vehicle-active='" + active + "' switchery-init=false required='required'></label></a>";
                        } else {
                            returnData = "<div class='switchery-xs'><a class='icon-primary'><label><input type='checkbox' name='switch_single' class='switchery' vehicle-active='" + active + "' switchery-init=false required='required'></label></a>";
                        }

                        return returnData;
                    }
                },
            ],
            "fnDrawCallback": function (oSettings) {
                var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
                elems.forEach(function (html) {
                    if ($(html).attr('switchery-init') == 'false') {
                        if ($(html).attr('vehicle-active') == 'true') {
                            $('.switchery').prop('checked', true);
                            var switchery = new Switchery(html);
                        } else {
                            $('.switchery').prop('checked', false);
                            var switchery = new Switchery(html, {secondaryColor: '#f44336', disabled: true});
                        }
                        $(html).attr('switchery-init', true);
                    }
                });
            }

        });

        /*$('.datatable-vehicle tbody').on('click', 'a#del', function () {
         var data = vehicle.row($(this).parents('tr')).data();
         if (data != undefined) {
         $('#deleteButton').val(data.id);
         $('#warningDel').click();
         }
         });*/

        $('.datatable-vehicle tbody').on('click', 'a.vehicleStatus', function () {
            var data = vehicle.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#confirmSubmit').val(JSON.stringify(data));
                $('#vehicleStatus').val(JSON.stringify(data));
                $('#deleteButton').val('');
                $('#vehicleStatus').click();
            }
        });

        $('.datatable-vehicle tbody').on('click', 'a.vehicleDelete', function () {
            var data = vehicle.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#confirmSubmit').val('');
                $('#vehicleStatus').val('');
                $('#deleteButton').val(data.reg_no);
                $('#deleteVehicle').click();
            }
        });

        $('.datatable-vehicle tbody').on('click', 'a.vehicleEdit', function () {
            var data = vehicle.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#editVehicle').val(data.reg_no);
                $('#editVehicle').click();
            }
        });

        var exam_details = $('.exam-details').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [-1]
                }],
            columns: [
                {data: "clssec", "orderable": "true", className: "text-center"},
                {data: "writtenExamName"},
                {data: "updatedDateAndName", className: "text-center"},
                {
                    data: '',
                    render: function (data, type, row) {
                        return "<span class='label notification_status'></span>"
                    }
                },
                {
                    data: '', className: "text-center",
                    render: function (data, type, row) {
                        if (row.editPermissions && isCurrentYear()) {
                            return "<a class='icon-primary' id='notifiedLog'><i class='icomoon-custom-size icon-file-eye' title='Logs'></i></a>";
                        } else {
                            return "<a class='icon-default' id='notifiedLog' disabled='disabled'><i class='icomoon-custom-size icon-file-eye' title='Logs'></i></a>";
                        }
                    }
                },
                {
                    data: '', className: "text-center",
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<button class='btn btn-xs btn-primary marklist-publish'>Publish</button>"
                        } else {
                            returnData = "<button class='btn btn-xs btn-default marklist-publish' disabled='disabled'>Publish</button>"
                        }

                        return returnData;
                    }
                },
                {
                    data: '', className: "text-center",
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary marklist-edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-danger marklist-delete'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>&nbsp;<a class='icon-primary marklist-stat'><i class='icon-stats-growth'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default marklist-delete' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='icon-stats-growth'></i></a>"
                        }

                        return returnData;
                    }
                },

            ],
            rowCallback: function (row, data) {
                if (data.status) {
                    $(row).find(".notification_status").removeClass('label-warning').addClass('label-success').text('Published');
                } else {
                    $(row).find(".notification_status").removeClass('label-success').addClass('label-warning').text('Generated');
                }
            }
        });

        $('.exam-details tbody').on('click', 'button.marklist-publish', function () {
            var data = exam_details.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#publish-marksheet').val(JSON.stringify(data));
                $('#publish-marksheet').click();
            }
        });
        $('.exam-details tbody').on('click', 'a.marklist-edit', function () {
            var data = exam_details.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#edit-marksheet').val(JSON.stringify(data));
                $('#edit-marksheet').click();
            }
        });
        $('.exam-details tbody').on('click', 'a.marklist-stat', function () {
            var data = exam_details.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#marksheet-stat').val(JSON.stringify(data));
                $('#marksheet-stat').attr('data-title', 'Statistics : ' + data.writtenExamName + ' - ' + data.className + ' / ' + data.sectionName);
                $('#marksheet-stat').click();
            }
        });
        $('.exam-details tbody').on('click', 'a#notifiedLog', function () {
            var data = exam_details.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#notificationLogs').val(JSON.stringify(data));
                $('#notificationLogs').click();
            }
        });

        //Attendance Feature

        var attendance = $('.datatable-attendance-export').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 9,
             className: "text-center",
             defaultContent: "<a class='icon-primary ' id='attendanceEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;"
             },*/
                {
                    orderable: false,
                    targets: [0, 9]
                }],
            order: [7, 'desc'],
            columns: [
                {data: "className", "orderable": "true"},
                {data: "sectionName"},
                {data: "totalStrength"},
                {data: "noOfPresent"},
                {data: "noOfAbsent"},
                {data: "presentPercent"},
                {data: "recordedUsername"},
                {data: "attendanceDate"},
                {data: "updatedUserName"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        return "<a class='icon-primary' id='notifiedLog'><i class='icomoon-custom-size icon-file-eye' title='Logs'></i></a>";
                    }
                },
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary ' id='attendanceEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;"
                        } else {
                            returnData = "<a class='icon-primary' id='attendanceEdit'><i class='fa fa-eye fa-lg' title='View'></i></a>"
                        }

                        return returnData;
                    }
                }
            ]
        });

        $('.datatable-attendance-export tbody').on('click', 'a#attendanceEdit', function () {
            var data = attendance.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#attendnceEdit').val(JSON.stringify(data));
                $('#attendnceEdit').attr('data-title', data.className + ' - ' + data.sectionName + ' (' + data.attendanceDate + ')');
                $('#attendnceEdit').click();
            }
        });
        $('.datatable-attendance-export tbody').on('click', 'a#notifiedLog', function () {
            var data = attendance.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#notificationLogs').val(JSON.stringify(data));
                $('#notificationLogs').click();
            }
        });

        //Attendance History

        var attendance_history = $('.datatable-attendance-history').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [1, 'asc'],
            columnDefs: [/*{
             targets: 7,
             defaultContent: "<a class='icon-primary' id='attendanceView'>    <i class='fa fa-eye fa-lg' title='View'></i>  </a>&nbsp;"
             },*/
                {
                    orderable: false,
                    targets: [0, 7]
                }],
            columns: [
                {data: "admissionNo", "orderable": "true"},
                {data: "firstName"},
                {data: "className"},
                {data: "sectionName"},
                {data: "present"},
                {data: "absent"},
                {data: "percent"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        return "<a class='icon-primary' id='attendanceView'>    <i class='fa fa-eye fa-lg' title='View'></i>  </a>&nbsp;"
                    }
                }
            ]
        });

        $('.datatable-attendance-history tbody').on('click', 'a#attendanceView', function () {
            var data = attendance_history.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#attendancesView').val(data.userName);
                $('#attendancesView').click();
            }


        });

        var classTimetable = $('.class_timetable_datatable').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 4,
             defaultContent: "<a class='icon-primary ' id='timetableEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a><!--<a id='timetableDelete'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>-->"
             },
             {
             targets: 5,
             defaultContent: "<a class='icon-primary ' id='addNotes'  (click)='uploadnotes($event)'><i class='fa fa-paperclip fa-lg'></i></a>"
             },*/

                {
                    orderable: false,
                    targets: [0, 5]
                }],
            order: [2, 'desc'],
            columns: [
                {data: "className", "orderable": "true"},
                {data: "sectionName"},
                {data: "schoolHours"},
                {data: "updatedUsername"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary ' id='timetableEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>"
                        } else {
                            returnData = "<a class='icon-primary'  id='timetableEdit'><i class='fa fa-eye fa-lg' title='View'></i></a>"
                        }

                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary ' id='addNotes'  (click)='uploadnotes($event)'><i class='fa fa-paperclip fa-lg'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-paperclip fa-lg'></i></a>"
                        }

                        return returnData;
                    }
                }
            ]

        });

        $('.class_timetable_datatable tbody').on('click', 'a#timetableDelete', function () {
            var data = classTimetable.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#warningButton').click();
            }

        });

        $('.class_timetable_datatable tbody').on('click', 'a#timetableEdit', function () {
            var data = classTimetable.row($(this).parents('tr')).data();
            $('#editButton').val(JSON.stringify(data));
            $('#editButton').click();
        });

        $('.class_timetable_datatable tbody').on('click', 'a#addNotes', function () {
            var data = classTimetable.row($(this).parents('tr')).data();
            $('#notesButton').val(JSON.stringify(data));
            $('#notesButton').click();
        });

        //SpecialDay Timetable

        var specialDay = $('.datatable-special-day').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [/*{
             targets: 5,
             defaultContent: "<a class='icon-primary specialDayEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a><!--<a class='icon-primary ' id='empView'><i class='fa fa-eye fa-lg' title='View'></i></a>-->&nbsp;<a class='icon-danger specialDayDelete'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                {
                    orderable: false,
                    targets: [0, 5]
                }],
            columns: [
                {data: "className", "orderable": "true"},
                {data: "sectionName"},
                {data: "date"},
                {data: "dayName"},
                {data: "updatedUsername"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary specialDayEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a><!--<a class='icon-primary ' id='empView'><i class='fa fa-eye fa-lg' title='View'></i></a>-->&nbsp;<a class='icon-danger specialDayDelete'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }
                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-special-day tbody').on('click', 'a.specialDayEdit', function () {
            var data = specialDay.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#specDayEdit').attr('data-title', 'Edit Special Timetable');
                $('#specDayEdit').val(JSON.stringify(data));
                $('#specDayEdit').click();
            }
        });

        $('.datatable-special-day tbody').on('click', 'a.specialDayDelete', function () {
            var data = specialDay.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#specDayWarning').click();
            }

        });

        //Events

        var eventTypes = $('.datatable-event-types').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a class='icon-primary' id='evntTypeEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                { "sWidth": "30%", "sClass": "right" ,targets:1},
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "event_type_name", "orderable": "true"},
                {data: "description"},
                {
                    data: "",
                    render: function (data, type, row, meta) {
                        return row.updated_username + ' - ' + row.updated_date;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='evntTypeEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-event-types tbody').on('click', 'a#del', function () {
            var data = eventTypes.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#warningEventType').click();
            }
        });

        $('.datatable-event-types tbody').on('click', 'a#evntTypeEdit', function () {
            var data = eventTypes.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#eventTypeEditButton').attr('data-title', 'Category - ' + data.event_type_name);
                $('#eventTypeEditButton').val(data.event_type_id);
                $('#eventTypeEditButton').click();
            }

        });

        var activityTypes = $('.datatable-activity-types').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a class='icon-primary' id='evntTypeEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "activity_type_name", "orderable": "true"},
                {data: "description"},
                {
                    data: "",
                    render: function (data, type, row, meta) {
                        return row.updated_username + ' - ' + row.updated_date;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='activityTypeEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-activity-types tbody').on('click', 'a#del', function () {
            var data = activityTypes.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#warningEventType').click();
            }
        });

        $('.datatable-activity-types tbody').on('click', 'a#activityTypeEdit', function () {
            var data = activityTypes.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#activityTypeEditButton').attr('data-title', 'Category - ' + data.activity_type_name);
                $('#activityTypeEditButton').val(data.activity_type_id);
                $('#activityTypeEditButton').click();
            }

        });

        var eventVenue = $('.datatable-event-venue').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [/*{
             targets: 4,
             data: null,
             defaultContent: "<a class='icon-primary' id='evntVenueEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                { "sWidth": "30%", "sClass": "right" ,targets:1},
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "venue_type_name", "orderable": "true"},
                {data: "location"},
                {
                    data: "",
                    render: function (data, type, row, meta) {
                        return row.updated_username + ' - ' + row.updated_date;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='evntVenueEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-event-venue tbody').on('click', 'a#del', function () {
            var data = eventVenue.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#warningEventVenue').click();
            }
        });

        $('.datatable-event-venue tbody').on('click', 'a#evntVenueEdit', function () {
            var data = eventVenue.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#eventVenueEditButton').attr('data-title', 'Venue - ' + data.venue_type_name);
                $('#eventVenueEditButton').val(data.venue_type_id);
                $('#eventVenueEditButton').click();
            }

        });

        var allocation = $('.datatable-allocation-export').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [2, 'desc'],
            columnDefs: [/*{
             targets: 5,
             data: null,
             defaultContent: "<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
             },*/
                {
                    orderable: false,
                    targets: [0, 5]
                }],
            columns: [
                {data: "academicYear", "orderable": "true"},
                {data: "className"},
                {data: "sectionName"},
                {data: "subjectName"},
                {data: "subjectType"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-allocation-export tbody').on('click', 'a#del', function () {
            var data = allocation.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#warningsubjectAllocation').click();
            }
        });


        var acdemics = $('.datatable-academics').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [0, 'asc'],
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "academicYear", "orderable": "true"},
                {data: "terms"},
                {data: "createdDate"},
                {
                    data: "",
                    render: function (data, type, row) {
                        return row.startDate + ' - ' + row.endDate;
                    }
                },
            ]
        });


        var departments = $('.datatable-department').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [0, 'asc'],
            columnDefs: [
                /*{
                 targets: 4,
                 data: null,
                 defaultContent: "<a class='icon-primary' id='editDepartment'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delDep'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                 },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "dept_name", "orderable": "true"},
                {data: "dept_alias"},
                {data: "updated_username"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='editDepartment'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delDep'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-department tbody').on('click', 'a#delDep', function () {
            var data = departments.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(data.dept_id);
                $('#warningDep').click();
            }
        });

        $('.datatable-department tbody').on('click', 'a#editDepartment', function () {
            var data = departments.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#updateDepartment').attr('data-title', 'Edit Department ');
                $('#updateDepartment').val(data.dept_id);
                $('#updateDepartment').click();
            }

        });

        var designation = $('.datatable-designation').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [
                /*{
                 targets: 4,
                 data: null,
                 defaultContent: "<a class='icon-primary' id='editDepartment'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delDep'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                 },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "desg_name", "orderable": "true"},
                {data: "desg_alias"},
                {data: "updated_username"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='editDesg'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delDesg'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-designation tbody').on('click', 'a#delDesg', function () {
            var data = designation.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(data.desg_id);
                $('#warningDesg').click();
            }
        });

        $('.datatable-designation tbody').on('click', 'a#editDesg', function () {
            var data = designation.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#updateDesg').attr('data-title', ' Edit Designation ');
                $('#updateDesg').val(data.desg_id);
                $('#updateDesg').click();
            }

        });

        var leave = $('.datatable-leave-type').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [
                /*{
                 targets: 4,
                 data: null,
                 defaultContent: "<a class='icon-primary' id='editDepartment'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delDep'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                 },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "leave_type_name", "orderable": "true"},
                {data: "description"},
                {data: "days"},
                {data: "updated_name"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='editLeave'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delLeave'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-leave-type tbody').on('click', 'a#delLeave', function () {
            var data = leave.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(data.leave_type_id);
                $('#warningLeav').click();
            }
        });

        $('.datatable-leave-type tbody').on('click', 'a#editLeave', function () {
            var data = leave.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#updateLeav').attr('data-title', 'Edit Leave Type');
                $('#updateLeav').val(data.leave_type_id);
                $('#updateLeav').click();
            }

        });

        var examType = $('.datatable-exam-type').DataTable({
            destroy: true,
            ajax: {
                url: url,
                headers: headers
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "written_exam_name", "orderable": "true"},
                {data: "written_exam_code", "orderable": "true"},
                {data: "updatedDate"},
                {data: "updatedUsername"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='editExamType'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delExamType'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }
                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-exam-type tbody').on('click', 'a#delExamType', function () {
            var data = examType.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#confirmSubmit').val('');
                $('#deleteButton').val(data.written_exam_id);
                $('#warningExamType').click();
            }
        });

        $('.datatable-exam-type tbody').on('click', 'a#editExamType', function () {
            var data = examType.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#updateExamType').attr('data-title', 'Edit Written Exam');
                $('#updateExamType').val(data.written_exam_id);
                $('#updateExamType').click();
            }

        });


        var report = $('table.datatable-reporting-leaves').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [1, 'desc'],
            columnDefs: [
                /*{
                 targets: 4,
                 data: null,
                 defaultContent: "<a class='icon-primary' id='editDepartment'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delDep'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                 },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "empId", "orderable": "true"},
                {data: "empName"},
                {data: "designation"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        return "<a class='icon-primary' id='viewLeav'><i class='fa fa-eye fa-lg' title='View'></i></a>"
                    }
                },
            ]
        });

        $('.datatable-reporting-leaves tbody').on('click', 'a#viewLeav', function () {
            var data = report.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#viewButton').attr('data-title', 'Leave History - ' + data.empName);
                $('#viewButton').val(JSON.stringify(data));
                $('#viewButton').click();
            }

        });

        var roles = $('.datatable-roles').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [3, 'desc'],
            columnDefs: [
                /*{
                 targets: 4,
                 data: null,
                 defaultContent: "<a class='icon-primary' id='editDepartment'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delDep'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                 },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "name", "orderable": "true"},
                {data: "description"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        return row.updated_username + ' - ' + row.updated_date;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.default_value && row.default_value != null) {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-primary' id='editRole'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delRole'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }

                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-roles tbody').on('click', 'a#editRole', function () {
            var data = roles.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#roleButton').attr('data-title', 'Role Name - ' + data.name);
                $('#roleButton').val(JSON.stringify(data));
                $('#roleButton').click();
            }

        });

        $('.datatable-roles tbody').on('click', 'a#delRole', function () {
            var data = roles.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(JSON.stringify(data));
                $('#roleWarning').click();
            }

        });


        var assignRoles = $('.datatable-assign-roles').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [1, 'desc'],
            "bAutoWidth": false,
            columnDefs: [
                {"sWidth": "40%", "sClass": "center", targets: 2},
                /*{
                 targets: 4,
                 data: null,
                 defaultContent: "<a class='icon-primary' id='editDepartment'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='delDep'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                 },*/
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "userName"},
                {data: "firstName", "orderable": "true"},
                {data: "roleNames[,]"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        return "<a class='icon-primary' id='editRole'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a><!--&nbsp;<a id='delRole'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>-->"
                    }
                },
            ],
        });

        $('.datatable-assign-roles tbody').on('click', 'a#editRole', function () {
            var data = assignRoles.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#assignRoleButton').attr('data-title', 'Role Name - ' + data.name);
                $('#assignRoleButton').val(JSON.stringify(data));
                $('#assignRoleButton').click();
            }

        });

        var suggestions = $('.datatable-suggestions').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            order: [1, 'desc'],
            "bAutoWidth": false,
            columnDefs: [
                {"sWidth": "50%", "sClass": "center", targets: 3},
                {
                    orderable: false,
                    targets: [0, 3]
                }],
            columns: [
                {data: "first_name"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        return row.class_name + ' - ' + row.section_name;
                    }
                },
                {data: "updated_date"},
                {data: "feedback_desc"}

            ],
        });

        var drivers = $('.datatable-drivers').DataTable({
            ajax: {
                url: url,
                headers: headers
                /*dataFilter: function(data){
                 return validateData(data);
                 }*/
            },
            "processing": true,
            order: [1, 'desc'],
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 4]
                }],
            columns: [
                {data: "driver_name", "orderable": "true"},
                {data: "driver_phone"},
                {data: "driver_dl_number"},
                {data: "driver_dl_validity"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='edit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a id='del' class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' disabled='disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;<a class='icon-default' disabled='disabled'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }
                        return returnData;
                    }
                },
            ]
        });

        $('.datatable-drivers tbody').on('click', 'a#edit', function () {
            var data = drivers.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#editDriver').attr('data-title', 'Edit Driver Details');
                $('#editDriver').val(data.id);
                $('#editDriver').click();
            }

        });

        $('.datatable-drivers tbody').on('click', 'a#del', function () {
            var data = drivers.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#deleteButton').val(data.id);
                $('#deleteWarning').click();
            }

        });

        var onboard = $('.datatable-onboard').DataTable({
            ajax: {
                url: url,
                headers: headers
                /*dataFilter: function(data){
                 return validateData(data);
                 }*/
            },
            "processing": true,
            columnDefs: [
                {
                    orderable: false,
                    targets: [0, 4]
                }],
            columns: [
                {data: "title"},
                {data: "count"},
                {data: "currentLogins"},
                {
                    data: '',
                    render: function (data, type, row) {
                        return "<span class='label onboard_status'></span>"
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "<a id='view' class='icon-primary'><i class='fa fa-eye fa-lg' title='View'></i></a>";

                        return returnData;
                    }
                },
            ],
            rowCallback: function (row, data) {
                if (data.status == "Sent" || data.status == "sent") {
                    $(row).find(".onboard_status").removeClass('label-warning').addClass('label-success').text(data.status);
                } else {
                    $(row).find(".onboard_status").removeClass('label-success').addClass('label-warning').text(data.status);
                }
            }
        });

        $('.datatable-onboard tbody').on('click', 'a#view', function () {
            var data = onboard.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#editButton').val(JSON.stringify(data));
                $('#editButton').attr('data-title', 'View Notifications');
                $('#editButton').click();
            }
        });


        //Assignment Datatables

        var hallOfFame = $('.datatable-hall-of-fame').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    targets: [0, 5]
                }],

            order: [4, 'desc'],
            columns: [
                {data: "award_name"},
                {data: "date_of_issue"},
                {data: "number_of_students"},
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "<span class='label hallOfFame_status'></span>"
                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<button id='hallOfFametPublish' class='btn btn-primary'>Publish</button>"
                        } else {
                            returnData = "<button disabled='disabled' class='btn btn-primary'>Publish</button>"
                        }

                        return returnData;
                    }
                },
                {
                    data: '',
                    render: function (data, type, row) {
                        var returnData = "";
                        if (row.editPermissions && isCurrentYear()) {
                            returnData = "<a class='icon-primary' id='hallOfFametEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a><a class='icon-primary ' id='hallOfFameView'><i class='fa fa-eye fa-lg' title='View'></i></a>&nbsp;<a id='hallOfFameDelete'class='icon-danger'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        } else {
                            returnData = "<a class='icon-default'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a><a class='icon-primary' id='hallOfFameView' title='View' ><i class='fa fa-eye fa-lg'></i></a>&nbsp;<a class='icon-default'><i class='fa fa-trash-o fa-lg' title='Delete'></i></a>"
                        }
                        return returnData;
                    }
                }
            ],
            rowCallback: function (row, data) {
                if (data.status == true) {
                    $(row).find(".hallOfFame_status").removeClass('label-danger').addClass('label-success').text('Published');
                } else {
                    $(row).find(".hallOfFame_status").removeClass('label-success').addClass('label-warning').text('Pending');
                }
            }
        });


        $('.datatable-hall-of-fame tbody').on('click', 'a#hallOfFameDelete', function () {
            var data = hallOfFame.row($(this).parents('tr')).data();
            if (data != undefined) {
                if (data.status == true) {
                    $('#deleteButton').val('');
                    showError("You cannot delete a published Hall of Fame Award");
                } else {
                    $('#deleteButton').val(JSON.stringify(data));
                    $('#HallOfFameWarning').click();
                }
            }
        });

        $('.datatable-hall-of-fame tbody').on('click', 'a#hallOfFametEdit', function () {
            var data = hallOfFame.row($(this).parents('tr')).data();
            if (data != undefined) {
                if (data.status == true) {
                    showNotification("Sorry! A published Hall of Fame Award cannot be edited.", "", "bg-danger");
                } else {
                    $('#EditHallOfFame').val(JSON.stringify(data.id));
                    $('#EditHallOfFame').attr('data-title','Edit Hall Of Fame');
                    $('#EditHallOfFame').click();
                }
            }
        });

        $('.datatable-hall-of-fame tbody').on('click', 'a#hallOfFameView', function () {
            var data = hallOfFame.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#viewHallOfFame').val(JSON.stringify(data));
                $('#viewHallOfFame').attr('data-title', data.award_name);
                $('#viewHallOfFame').click();
            }
        });

        $('.datatable-hall-of-fame tbody').on('click', 'button#hallOfFametPublish', function () {
            var data = hallOfFame.row($(this).parents('tr')).data();
            if (data != undefined) {
                if (data.status == true) {
                    showNotification("Sorry! A published Hall of Fame Award cannot be published again.", "", "bg-danger");
                } else {
                    $('#publishHallOfFame').val(JSON.stringify(data));
                    $('#publishHallOfFame').attr('data-title', data.award_name);
                    $('#publishHallOfFame').click();
                }
            }
        });

        //parentInformation Datatables
        var parentInformation = $('.datatable-parentInformation').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [
                {
                    targets: [0, 4]
                }],

            order: [4, 'desc'],

            columns: [
                {data: "father_name"},
                {data: "user_name"},
                {data: "noOfWards"},
                {data: "updatedUserName"},
                {
                    data: '',
                    render: function (data, type, row) {
                        if (isCurrentYear()) {
                            return "<a class='icon-primary' id='parentInfoEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>";
                        }else {
                            return "<a class='icon-default' disabled= 'disabled'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>";
                        }
                    }
                }
            ]
        });

        $('.datatable-parentInformation tbody').on('click', 'a#parentInfoEdit', function () {
            var data = parentInformation.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#editParentInfo').attr('data-title', 'Edit ParentInformation ');
                $('#editParentInfo').val(JSON.stringify(data));
                $('#editParentInfo').click();
            }
        });


        var promotions = $('.datatable-promotions').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 9,
             className: "text-center",
             defaultContent: "<a class='icon-primary ' id='attendanceEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;"
             },*/
                {
                    orderable: false,
                    targets: [0, 5]
                }],
            columns: [
                {data: "academic_year", "orderable": "true"},
                {data: "class_name"},
                {data: "new_academic_year"},
                {data: "promoted_class_name"},
                {data: "updated_firstname"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData ;
                        if (row.editPermissions) {
                            returnData = "<a class='icon-success' id='studentView' ><i class='fa icon-user-check icon-lg'></i></a>&nbsp;<a class='icon-danger' id='depromoteStud'><i class='fa icon-user-cancel icon-lg'></i></a>"
                        } else {
                            returnData = "<a class='icon-default' id='studentView' disabled='disabled'><i class='fa icon-user-check icon-lg'></i></a>&nbsp;<a class='icon-default' id='depromoteStud' disabled='disabled'><i class='fa icon-user-cancel icon-lg'></i></a>"
                        }

                        return returnData;
                    }
                }
            ]
        });

        $('.datatable-promotions tbody').on('click', 'a#studentView', function () {
            var data = promotions.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#studentViewData').val(JSON.stringify(data));
                $('#studentViewData').click();
            }
        });

        $('.datatable-promotions tbody').on('click', 'a#depromoteStud', function () {
            var data = promotions.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#depromoteStudents').val(JSON.stringify(data));
                $('#depromoteStudents').click();
            }
        });

        var shuffle = $('.datatable-shuffle').DataTable({
            ajax: {
                url: url,
                headers: headers,
                dataFilter: function (data) {
                    return validateData(data);
                }
            },
            "processing": true,
            columnDefs: [/*{
             targets: 9,
             className: "text-center",
             defaultContent: "<a class='icon-primary ' id='attendanceEdit'><i class='fa fa-pencil-square-o fa-lg' title='Edit'></i></a>&nbsp;"
             },*/
                {
                    orderable: false,
                    targets: [0, 4]
                }],
            columns: [
                {data: "academic_year", "orderable": "true"},
                {data: "class_name"},
                {data: "new_academic_year"},
                {data: "promoted_class_name"},
                {data: "updated_firstname"},
                {
                    data: '',
                    render: function (data, type, row, meta) {
                        var returnData ;
                        if (row.editPermissions) {
                            returnData = "<a class='icon-success' id='shuffle_studnet' ><i class='fa icon-shuffle icon-lg'></i></a>&nbsp;"
                        } else {
                            returnData = "<a class='icon-default' id='shuffle_studnet' disabled='disabled'><i class='fa icon-shuffle icon-lg'></i></a>&nbsp;"
                        }

                        return returnData;
                    }
                }
            ]
        });
        $('.datatable-shuffle tbody').on('click', 'a#shuffle_studnet', function () {
            var data = shuffle.row($(this).parents('tr')).data();
            if (data != undefined) {
                $('#Shuffle').val(JSON.stringify(data));
                $('#Shuffle').click();
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

        cloumnSearchBox('datatable-student', [6, 7, 8])
        columSearchData(students);
        cloumnSearchBox('datatable-employee', [6, 7, 8])
        columSearchData(employees);

    });

}

$(document).on('click', 'body .confirm', function () {
    $('#deleteButton').click();
    $('#resetPwd').click();
    $('#confirmSubmit').click();
    $('#confirmAttachment').click();
});
$(document).on('click', 'body .cancel', function () {
    $('#deleteButton').val('');
    $('#resetPwd').val('');
    $("#reload").click();
    $('#confirmSubmit').val('');
    $('#confirmAttachment').val('');
});

function validateAssignee(seats) {
    var rows = assignStudents.rows({'search': 'applied'}).nodes();
    var checkall = document.getElementById('select-all');
    if (seats == 0 || seats > rows.length) {
        // console.info(seats+ ' if....',rows.length);
        // console.info('this....', $('#select-all'));
        // console.info('this.checked....', checkall.checked);
        $('input[type="checkbox"]', rows).prop('checked', checkall.checked);
    } else {
        // console.info('else....');
        showInfoWarning("You can't select more than " + seats + " students", 'ok', 'warning');
        checkall.checked = !checkall.checked;
        $('input[type="checkbox"]', rows).prop('checked', checkall.checked);
    }
}

function validateData(data) {
    var body = $.parseJSON(data);
    if (body != null && body != 'undefined') {
        if (body.validSession != null && body.validSession != 'undefined' && !body.validSession) {
            $('#logoutId').click()
            body.data = []
            return JSON.stringify(body);
        }
    }
    if (!body.success) {
        showInformation('top', 'Error in Loading this Page, Please Contact Admin.', 'error');
        body.data = []
        return JSON.stringify(body);
    }
    return data;
}

function hideColumn(id, column) {
    var table = $(id).DataTable();
    for (var key in column) {
        table.columns(column[key]).visible(false);
    }
}

var routes = [];
function getAllRoutes(routeDatas) {
    routes = routeDatas;
}


function cloumnSearchBox(id, colArray) {
    $('.' + id + ' tfoot th').each(function () {
        var title = $('.' + id + ' thead th').eq($(this).index()).text();
        var arr = new Set(colArray)
        if (!arr.has($(this).index()))
            $(this).html('<input type="text" class="form-control input-sm input-sm-height-28" placeholder="' + title + '" />');

    });

    $('.' + id + ' tfoot tr').appendTo('.' + id + ' thead')
}

function columSearchData(table) {
    // $('.datatable-student').parent('div').parent('div').find('.dataTables_filter').hide();
    table.columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
            that.search(this.value).draw();
        });
    });
}

$(document).on('click', 'a.marklist-delete', function () {
    var exam_details = $('.exam-details').DataTable();
    var data = exam_details.row($(this).parents('tr')).data();
    if (data.status != null && data.status != 'undefined' && data.status) {
        $('#deleteButton').val('');
        showError("You Can't delete the Mark List!");
    } else {
        $('#deleteButton').val(JSON.stringify(data));
        $('#warningButton').click();
    }

});
