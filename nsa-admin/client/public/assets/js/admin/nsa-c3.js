/**
 * Created by senthil on 07/09/17.
 */
function enableC3(id, data) {
    //var colorArray = ['#FF6600', '#EC81B3', '#0D8ECF', '#CD0D74', '#0D52D1', '#999999', '#333333', '#754DEB', '#000000', '#FF0F00']
    var colorArray = ['#20783F', '#A3FF7F', '#FFD127', '#FFFE4A', '#FF8E0B', '#FFB91A', '#FF5B14', '#FF2014', '#7D2403', '#FF0F00']
    var chart = c3.generate({
        bindto: id,
        animation: true,
        onclick: function (d, element) {
            console.log('element', element)
        },
        data: {
            x : 'Grades',
            columns: [
                ['Grades'].concat(data['ranges']),
                ['Students'].concat(data['values'])

            ],
            type: 'bar',
            labels: {
                format: function (v, id, i, j) {
                    return v;
                }
            },
            selection: {
                enabled: false
            },
            colors: {
                Students: function (d) {
                    return colorArray[d.index] || '#EC81B3';
                }
            }
        },
        axis: {
            x: {
                type: 'category',
                label: {
                    text: 'Grade Distribution',
                    position: 'outer-center'
                }
            },
            y: {
                label: {
                    text: 'Number of Students',
                    position: 'outer-middle'
                },
                tick: {
                    format: function (d) {
                        return (parseInt(d) == d) ? d : null;
                    }
                }
            },

        },
        labels: true,
        legend: {
            show: false
        },
        tooltip: {
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                color = function() {
                    return colorArray[d[0].index] || '#EC81B3';
                };
                return chart.internal.getTooltipContent.call(this, d, defaultTitleFormat, defaultValueFormat, color)
            }
        }
    });

    $(".sidebar-control").on('click', function() {
        chart.resize();
    });
}

function disableC3(chart) {
    if(chart != undefined)
        chart.destroy()
}
