/* ------------------------------------------------------------------------------
 *
 *  # Google Visualization - columns
 *
 *  Google Visualization column chart demonstration
 *
 *  Version: 1.0
 *  Latest update: August 1, 2015
 *
 * ---------------------------------------------------------------------------- */


// Column chart
// ------------------------------

// Initialize chart
google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawColumn);
google.setOnLoadCallback(drawGradeStatistics);


// Chart Grade Statistics
function drawGradeStatistics() {

    // Data
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales', 'Expenses'],
        ['2004',  1000,      400],
        ['2005',  1170,      460],
        ['2006',  660,       1120],
        ['2007',  1030,      540]
    ]);


    // Options
    var options_column = {
        fontName: 'Roboto',
        height: 400,
        fontSize: 12,
        chartArea: {
            left: '5%',
            width: '90%',
            height: 350
        },
        tooltip: {
            textStyle: {
                fontName: 'Roboto',
                fontSize: 13
            }
        },
        vAxis: {
            title: 'Sales and Expenses',
            titleTextStyle: {
                fontSize: 13,
                italic: false
            },
            gridlines:{
                color: '#e5e5e5',
                count: 10
            },
            minValue: 0
        },
        legend: {
            position: 'top',
            alignment: 'center',
            textStyle: {
                fontSize: 12
            }
        }
    };

    // Draw chart
    var column = new google.visualization.ColumnChart($('#google-column')[0]);
    column.draw(data, options_column);

}


// Chart settings
function drawColumn() {

    // Data
    var data = google.visualization.arrayToDataTable([
        ['Grade', '', { role: 'style' }],
        ['A1',  20, '#b87333'],
        ['A2',  25, 'silver'],
        ['B1',  14, 'gold'],
        ['B2',  7, '#e5e4e2'],
        ['C1',  4, '#b87333'],
        ['C2',  2, 'gold'],
        ['D',  3, 'silver']

    ]);


    // Options
    var options_column = {
        fontName: 'Roboto',
        height: 300,
        fontSize: 12,
        chartArea: {
            left: '15%',
           width: '80%',
           height: 250
        },
        tooltip: {
            textStyle: {
                fontName: 'Roboto',
                fontSize: 13
            }
        },
        vAxis: {
            title: 'No of Students',
            titleTextStyle: {
                fontSize: 13,
                italic: false
            },
            gridlines:{
                color: '#e5e5e5',
                count: 10
            },
            minValue: 0
        }
    };

    // Draw chart
    var column = new google.visualization.ColumnChart($('#grade_statistics')[0]);
    column.draw(data, options_column);
}


// Resize chart
// ------------------------------

$(function () {

    // Resize chart on sidebar width change and window resize
    $(window).on('resize', resize);
    $(".sidebar-control").on('click', resize);

    // Resize function
    function resize() {
        drawColumn();
        drawGradeStatistics();
    }
});
