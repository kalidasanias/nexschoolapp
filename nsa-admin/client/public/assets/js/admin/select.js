/**
 * Created by senthil on 2/11/2017.
 */
const arr = ["senthil", "cyril", "deepak", "kiran", "vino"];
const select = ['c4647b51-5a52-42fc-94cd-e3e159f9fe58', '09147fbc-a56d-416e-bc5c-c3ff6bf138f0']

var selectOption = {

    navSelect: function() {
        $('.menu-list').find('li').has('ul').parents('.menu-list').addClass('has-children');
        $('.has-children').dcDrilldown({
            defaultText: 'Back to parent',
            saveState: true
        });
    },

    enableSelect: function(ele, data, obj, selected) {
        var options = this.buildOptions(data ? data : arr, obj);
        $(ele).html(options).selectpicker('refresh');
        $(ele).html(options).selectpicker('select', selected);
        this.updateSingleSelect(ele, selected);
    },

    enableSelectBoxIt: function(ele, data, obj, selected) {
        var options = this.buildOptions(data ? data : arr, obj);
        $(ele).selectBoxIt({autoWidth: false, populate: options });
        $(ele).find("option[value='"+ selected + "']").attr('selected','selected');
        $(ele).data("selectBox-selectBoxIt").refresh();
        /*$(ele).selectBoxIt().change(function() {
            this.click();
            // console.log('changing selectbox....', this.value);
        });*/
    },

    slideUp: function(ele) {
        $(ele).easyTicker({
            direction: 'up',
            visible: 3,
            height: '170px',
        })
    },

    enableMultiSelect: function(ele, data, obj, selected) {
        var options = this.buildOptions(data? data: arr, obj);
        $(ele).html(options).multiselect('refresh');
        $(ele).html(options).multiselect('select', selected);
        this.selectStyle();
    },

    enableMultiSelectDefaultAll: function(ele, data, obj, selected, onChangeFn) {
        var options = this.buildSelectAllOptions(data? data: arr, obj);
        $(ele).html(options).multiselect('refresh');
        $(ele).html(options).multiselect('select', selected);
        this.selectStyle();
    },

    enableMultiSelectAll: function(ele, data, obj, selected) {
        $(ele).multiselect('destroy');
        var options = this.buildOptions(data? data: arr, obj);
        $(ele).html(options).multiselect('refresh');
        $(ele).html(options).multiselect({
            includeSelectAllOption: true,
            onSelectAll: function () {
                $.uniform.update();
            }
        });
        this.updateSelected(ele, selected);
        this.selectStyle();
    },

    enableMultiSelectAllWithLabel: function(ele, data, obj, label, selected) {
        this.enableMultiSelectFilteringAll(ele, data, obj, selected)
        $(ele).next('div').find('.multiselect-selected-text').text(label);
    },

    enableMultiSelectFilteringAll: function(ele, data, obj, selected) {
        var options = this.buildOptions(data? data: arr, obj);
        $(ele).html(options).multiselect('destroy');
        $(ele).html(options).multiselect({
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true,
            templates: {
                filter: '<li class="multiselect-item multiselect-filter"><i class="icon-search4"></i> <input class="form-control" type="text"></li>'
            },
            includeSelectAllOption: true,
            onSelectAll: function () {
                $.uniform.update();
            }
        });

        this.updateSelected(ele, selected);
        this.selectStyle();
        disableLoading();
    },

    enableSearchSelectForStudent: function(ele, data, obj, selected) {
        var options = this.buildStudents(data? data: arr, obj);
        $(ele).html(options).multiselect('destroy');
        $(ele).html(options).multiselect({
            enableFiltering: true,
            templates: {
                filter: '<li class="multiselect-item multiselect-filter"><i class="icon-search4"></i> <input class="form-control" type="text"></li>'
            },
            includeSelectAllOption: true,
            onSelectAll: function () {
                $.uniform.update();
            }
        });

        this.updateSelected(ele, selected);
        this.selectStyle();
    },

    enableSelectWithEmpty: function(ele, data, obj, selected) {
        var options = this.buildOptions1(data ? data : arr, obj);
        $(ele).html(options).selectpicker('refresh');
        $(ele).html(options).selectpicker('select', selected);
        this.updateSingleSelect(ele, selected);
    },

    enableSelectWithLabel: function(ele, data, obj, label, selected) {
        var options = this.buildOptionsWithLabel(label, data ? data : arr, obj);
        $(ele).html(options).selectpicker('refresh');
        $(ele).html(options).selectpicker('select', selected);
        this.updateSingleSelect(ele, selected);
    },

    enableSelectWithDisabled: function(ele, data, obj, selected, status) {
        var options = this.buildDisabled(data? data: arr, obj, status, 'multiple');
        $(ele).html(options).multiselect('destroy');
        $(ele).html(options).multiselect({
            enableFiltering: true,
            templates: {
                filter: '<li class="multiselect-item multiselect-filter"><i class="icon-search4"></i> <input class="form-control" type="text"></li>'
            },
            includeSelectAllOption: true,
            onSelectAll: function () {
                $.uniform.update();
            }
        });

        this.updateSelected(ele, selected);
        this.selectStyle();
    },

    enableSingleSelWithDisabled: function(ele, data, obj, selected, status) {
        var options = this.buildDisabled(data ? data : arr, obj, status, 'single');
        $(ele).html(options).selectpicker('refresh');
        $(ele).html(options).selectpicker('select', selected);
        this.updateSingleSelect(ele, selected);
    },

    enableSelectWithTipAndEmpty: function(ele, data, obj, selected) {
        var options = this.buildOptions1(data ? data : arr, obj);
        $(ele).html(options).selectpicker('refresh');
        $(ele).html(options).selectpicker('select', selected);
        $(ele).data('selectpicker').$lis.attr('title', function(index, atr){
            $(this).attr('title', $(this)[0].innerText);//.tooltip({placement: 'bottom', trigger:'click'});
        });
        this.updateSingleSelect(ele, selected);
    },

    enableSelect2WithEmpty: function(ele, data, obj, selected) {
        var options = this.buildOptions1(data ? data : arr, obj);
        $(ele).html(options).select2({minimumResultsForSearch: Infinity}).select('val', selected);
    },

    destroySelect2: function(ele) {
        $(ele).select2('destroy');
    },

    buildOptions: function(datas, object) {
        var options = '';
        for(var i=0; i< datas.length; i++) {
            var data = datas[i];
            var label = object[0];
            var value = object[1];
            var name = object[2];
            var labelValue = object.length > 2 ? data[label] + ' - ' + data[name] : data[label];
            options = options + '<option value=' + data[value] + '>' + labelValue + '</option>'
        }
        return options
    },

    buildSelectAllOptions: function(datas, object) {
        var options = '';
        for(var i=0; i< datas.length; i++) {
            var data = datas[i];
            var label = object[0];
            var value = object[1];
            var name = object[2];
            var labelValue = object.length > 2 ? data[label] + ' - ' + data[name] : data[label];
            options = options + '<option value=' + data[value] + ' selected="selected">' + labelValue + '</option>'
        }
        return options
    },

    buildStudents: function(datas, object) {
        var options = '';
        for(var i=0; i< datas.length; i++) {
            var data = datas[i];
            var id = object[0];
            var value = object[1];
            var name = object[2];
            var clasName = object[3];
            var secName = object[4];
            var labelValue = object.length > 2 ? data[id] + ' - ' + data[name] + '('+ data.classes[0][clasName] + ' - ' + data.classes[0][secName] + ')' : data[id];
            options = options + '<option value=' + data[value] + '>' + labelValue + '</option>'
            options = options + '<option value=' + data[value] + '>' + labelValue + '</option>'
        }
        return options
    },

    buildDisabled: function(datas, object, status, selection) {
        var options = '';
        if(selection == 'single') {
            options = '<option value="">None Selected</option>';
        }
        for(var i=0; i< datas.length; i++) {
            var data = datas[i];
            var label = object[0];
            var value = object[1];
            var name = object[2];
            var labelValue = object.length > 2 ? data[label] + ' - ' + data[name] : data[label];
            if(data[status] == false) {
                options = options + '<option value=' + data[value] + ' disabled>' + labelValue + '</option>'
            } else {
                options = options + '<option value=' + data[value] + '>' + labelValue + '</option>'
            }
        }

        return options
    },

    buildOptions1: function(datas, object) {
        var options = '<option value="">None Selected</option>';
        for(var i=0; i< datas.length; i++) {
            var data = datas[i];
            var label = object[0]
            var value = object[1]
            options = options + '<option data-toggle="tooltip"  placement=' + data[label] + ' value=' +  data[value] + '>' + data[label] + '</option>'
        }
        return options
    },

    buildOptionsWithLabel: function(label, datas, object) {
        var options = '<option value="">' + label + '</option>';
        for(var i=0; i< datas.length; i++) {
            var data = datas[i];
            var label = object[0]
            var value = object[1]
            options = options + '<option data-toggle="tooltip"  placement=' + data[label] + ' value=' +  data[value] + '>' + data[label] + '</option>'
        }
        return options
    },

    updateSelected: function(ele, selectedValues) {
        $(ele).val(selectedValues);
        $(ele).multiselect("refresh");

    },

    selectStyle: function() {
        $(".styled, .multiselect-container input").uniform({radioClass: 'choice'});

        $(".control-primary").uniform({
            radioClass: 'choice',
            wrapperClass: 'border-primary-600 text-primary-800'
        });
    },


    updateSingleSelect: function(ele, selectedValues) {
        if(selectedValues != null) {
            $(ele).selectpicker('val',selectedValues);
        }
    },

    disableSelect(ele, status) {
        $(ele).prop('disabled', status);
        $(ele).selectpicker('refresh');
    }

}

$(document).on('change', 'body .select-wizard', function () {
    var selectName = $(this).attr('name');
    $('#'+selectName).click();
});

$(document).on('change', 'body .select-change', function () {
    $(this).click();
});

function dateChange(event, i) {
    event.target.click(event, i);
}
