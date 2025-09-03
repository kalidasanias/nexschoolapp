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

$(function() {


    // Table setup
    // ------------------------------

    // Setting datatable defaults
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        dom: '<"datatable-header"fBl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
        language: {
            search: '<span>Filter:</span> _INPUT_',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
        },
        select: {
            style: 'multi'
        },
        responsive: true,
        columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: -1 }
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

    // Column selectors
    $('.datatable-export').DataTable({
		
    });
	
	 $('.datatable-export-multiple').DataTable({
        columnDefs: [
            {
                orderable: false,
                className: 'select-checkbox',
                targets: 0
            },
            {
                orderable: false,
                width: '100px',
                targets: 4
            }
        ],
        select: {
            style: 'multi'
        },
        order: [[1, 'asc']]
    });

    // External table additions
    // ------------------------------

    // Add placeholder to the datatable filter option
    $('.dataTables_filter input[type=search]').attr('placeholder','Type to filter...');


    // Enable Select2 select for the length option
    $('.dataTables_length select').select2({
        minimumResultsForSearch: Infinity,
        width: 'auto'
    });
    
});
