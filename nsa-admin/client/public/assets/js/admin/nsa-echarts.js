/**
 * Created by senthil on 06/09/17.
 */
function enableEcharts(id, data) {
    require.config({
        paths: {
            echarts: './public/assets/js/plugins/visualization/echarts'
        }
    });

    require(
        [
            'echarts',
            'echarts/theme/limitless',
            'echarts/chart/bar',
            'echarts/chart/line'
        ],
        // Charts setup
        function (ec, limitless) {

            var basic_columns = ec.init(document.getElementById(id), limitless);

            basic_columns_options = {

                // Setup grid
                grid: {
                    x: 40,
                    x2: 40,
                    y: 35,
                    y2: 25
                },

                color: ['#48c9d8'],

                // Add tooltip
                tooltip: {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    },
                    formatter: function (params) {
                        var res = 'Grade : ' + params[0].name;
                        for (var i = 0; i < params.length; i++) {
                            res += '<br/>Total Students'+ ' : ' + params[i].value;
                        }
                        return res
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: data['ranges']
                }],

                yAxis: [{
                    type: 'value'
                }],

                // Add series
                series: [
                    {
                        name: 'Grade',
                        type: 'bar',
                        data: data['values'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        fontWeight: 500
                                    }
                                }
                            }
                        }
                    }
                ]
            };

            basic_columns.setOption(basic_columns_options);

            window.onresize = function () {
                setTimeout(function () {
                    basic_columns.resize();
                }, 200);
            }

        }
    );
}

function disableEcharts(id) {
    require.config({
        paths: {
            echarts: './public/assets/js/plugins/visualization/echarts'
        }
    });

    require(
        [
            'echarts',
            'echarts/theme/limitless',
            'echarts/chart/bar',
            'echarts/chart/line'
        ],
        // Charts setup
        function (ec, limitless) {
            var basic_columns = ec.init(document.getElementById(id), limitless);
            basic_columns.dispose();
        });



}