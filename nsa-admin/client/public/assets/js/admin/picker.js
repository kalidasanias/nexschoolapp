/**
 * Created by Sai Deepak on 09-Apr-17.
 */

var pickerOption = {

    enableTimePicker: function (ele, val) {

        $(ele).AnyTime_picker({
            format: "%H:%i"
        });

        if(val != null) {
                console.log(val);
            $(ele).val(val);
        }
    }

}


