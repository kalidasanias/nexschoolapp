/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
function showNotification(title, msg, type) {

    $.jGrowl(msg, {
        header: title,
        theme: type
    });
}

window.showNotification = showNotification;

function showInformation(position, msg, type) {
    noty({
        width: 200,
        text: msg,
        type: type,
        dismissQueue: true,
        timeout: 3000,
        layout: position
    });
}
window.showInformation = showInformation;
function showWarning() {
    swal({
        title: "Are you sure?",
        type: "warning",
        /*animation: "slide-from-top",*/
        showCancelButton: true,
        showCancelColor: "#FF7043",
        confirmButtonColor: "#FF7043",
        confirmButtonText: "Yes, delete it!"
    });
}
window.showWarning = showWarning;

function showInfoWarning(title, text, type) {
    swal({
        title: title,
        type: type,
        /*animation: "slide-from-top",*/
        showCancelButton: true,
        showCancelColor: "#FF7043",
        confirmButtonColor: "#FF7043",
        confirmButtonText: text,

    });
}
window.showInfoWarning = showInfoWarning;


function showWarningWithButtonsText(title, text, canceltext, type) {
    swal({
        title: title,
        type: type,
        /*animation: "slide-from-top",*/
        showCancelButton: true,
        showCancelColor: "#FF7043",
        confirmButtonColor: "#FF7043",
        confirmButtonText: text,
        cancelButtonText: canceltext,
    });
}
window.showWarningWithButtonsText = showWarningWithButtonsText;

function showError() {
    swal({
        title: "Oops...",
        text: "Something went wrong!",
        confirmButtonColor: "#EF5350",
        type: "error"
    });
}
window.showError = showError;

function enableLoading() {
    $.blockUI({
        message: '<i class="icon-spinner4 spinner"></i>',
        overlayCSS: {
            backgroundColor: '#1b2024',
            opacity: 0.8,
            cursor: 'wait'
        },
        css: {
            border: 0,
            color: '#fff',
            padding: 0,
            backgroundColor: 'transparent'
        }
    });
}

window.enableLoading = enableLoading;

function enableLoadingWithMsg(message) {
    $.blockUI({
        message: '<span class="text-semibold"><i class="icon-spinner4 spinner"></i>&nbsp; '+ message + '</span>',
        overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.8,
            'z-index': 1005
        },
        css: {
            border: 0,
            left: '45%',
            padding: '5px 10px',
            color: '#fff',
            width: 'auto',
            '-webkit-border-radius': 2,
            '-moz-border-radius': 2,
            backgroundColor: '#333'
        }
    });
}
window.enableLoadingWithMsg = enableLoadingWithMsg;

function disableLoading() {
    $.unblockUI({
        onUnblock: function(){ }
    });
}
window.disableLoading = disableLoading;

function enableDivLoading(eleAttr, msg) {
    var block = $(eleAttr).parent();
    $(block).block({
        message: '<span class="text-semibold"><i class="icon-spinner4 spinner"></i>&nbsp;' + msg + '</span>',
        overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.8,
            cursor: 'wait'
        },
        css: {
            border: 0,
            padding: 0,
            backgroundColor: 'transparent'
        }
    });

}

window.enableDivLoading = enableDivLoading;

function disableDivLoading(eleAttr) {
    var block = $(eleAttr).parent();
    $(block).unblock();
}

window.disableDivLoading = disableDivLoading;

function enableBtnLoading(id) {
    var loder = Ladda.create( document.querySelector( '#'+ id ) );
    loder.start();
}

window.enableBtnLoading = enableBtnLoading;

function disableBtnLoading(id) {
    var loder = Ladda.create( document.querySelector( '#'+ id ) );
    loder.stop();
}
window.disableBtnLoading = disableBtnLoading;

function dataTableReload(attr) {
    $('.'+ attr).DataTable().ajax.reload();
}
window.dataTableReload = dataTableReload;

function getTableDate(attr) {
    oTable.fnGetData();
}
window.getTableDate = getTableDate;

function addAspects() {
    $(document).on('click','.add-more',function(e){
        e.preventDefault();
        var controlForm = $('.controls form:first');
        $(' <div><br/><br/><br/><div class="col-md-offset-4 col-sm-6"> <select data-placeholder="Select your country" class="bootstrap-select" data-width="100%"> <option value="Cambodia">Reading</option> <option value="Martic">Writing</option> </select> </div> <div class="col-sm-2"> <a class="icon-success margin-top10 add-more"><i class="fa fa-plus-circle fa-lg"></i></a>&nbsp; <a class="icon-danger margin-top10 deleteParent"><i class="fa fa-minus-circle fa-lg"></i></a> </div> </div>').appendTo('.add-class');
        controlForm.find('.add-more:first')
            .removeClass('icon-success').addClass('icon-danger')
            .html('<i class="fa fa-minus-circle fa-lg"></i>');
        $('.bootstrap-select').selectpicker('refresh');

    });
    $(document).on('click','.deleteParent',function(e){
        e.preventDefault();
        $(this).parent().parent().remove();
        if($('.add-class').is(':empty')) {
            $('.add-more').removeClass('icon-danger').addClass('icon-success')
                .html('<i class="fa fa-plus-circle fa-lg"></i>');
        }
    });
}
window.addAspects = addAspects;

function HTMLtoPDF(url, name, headers) {
    $.ajax({
        type: 'GET',
        url: url,
        headers: headers,
        async: true,
        crossDomain:true,
        success: function (result) {
            $("#printerLogo").attr("src", result.data);
            generatePDF(name);
        }
    });
}
window.HTMLtoPDF = HTMLtoPDF;

function generatePDF(name) {
    $('.pdf-content').css('display', 'block');
    window.scrollTo(0, 0);
    var pdf = new jsPDF('p', 'pt', 'a4');
    html2canvas($("#HTMLtoPDF")[0], {
        onrendered: function (canvas) {
            var imgData = canvas.toDataURL("image/png", 1.0);
            pdf.addImage(imgData, 'JPEG', 50, 25, (520), (document.getElementById('HTMLtoPDF').offsetHeight/2));
            //pdf.addImage(imgData, 'JPEG', 20, 50, (500), (350));
            //pdf.setFontSize(10);
            pdf.save(name + '.pdf');
            $('.pdf-content').css('display', 'none');

        }
    });
}

function dataTableDestroy(attr) {
    var table = $('.'+ attr).DataTable();
    table.clear();
    table.destroy();
}
window.dataTableDestroy = dataTableDestroy;

function dataTableAdjust(attr) {
    $('.'+ attr).DataTable().columns.adjust().responsive.recalc();
}
window.dataTableAdjust = dataTableAdjust;
/*
 function enableDataForDatatable(url, headers) {

 var tableNested = $('.datatable-nested1').DataTable({
 ajax: {
 url: url,
 headers: headers,
 },
 "processing": true,
 columnDefs: [{
 targets: 4,
 data: null,
 defaultContent: ""
 },
 {
 orderable: false,
 targets: [0, 3]
 }],
 columns: [
 {data: "title"},
 {data: "message"},
 {data: "primary_phone"},
 {data: "status"},
 ]
 });
 }*/

/*
 function showWarning() {
 swal({
 title: "Are you sure?",
 text: "You will not be able to recover this imaginary file!",
 type: "warning",
 animation: "slide-from-top",
 showCancelButton: true,
 showCancelColor: "#FF7043",
 confirmButtonColor: "#FF7043",
 confirmButtonText: "Yes, delete it!"
 });

 $(document).on('click','body .confirm',function(){

 });
 $(document).on('click','body .cancel',function(){
 $('#deleteButton1').val('');
 });
 }
 */

$(document).on('click','body #Print',function(){
    printElement(document.getElementById("printThis"));
});

function rportData(data) {
    var byteArray = new Uint8Array(data['pdf'].data);
    var blob = new Blob([byteArray], {type: "application/pdf"});
    var url = URL.createObjectURL(blob);
    //window.open(url)
    $('#print_frame').html();
    $('#print_frame').attr('src', url);
    $('#print_frame').load(function () {
        setTimeout(function () {
            isLoaded();
        }, 2000)


    });
}

function isLoaded() {
    var pdfFrame = window.frames["print_frame"];
    pdfFrame.focus();
    pdfFrame.print();
    disableDivLoading('.datatable-student')
    disableDivLoading('.generateReport')
}

function printElement(elem) {
    var domClone = elem.cloneNode(true);

    var $printSection = document.getElementById("printSection");

    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }

    $printSection.innerHTML = "";
    $printSection.appendChild(domClone);
    window.print();
}
window.printElement = printElement;

$(document).on('click','button#savechannelFeature',function(){
    var smschek= $(this).closest('tr').find('.smsChannel input:checkbox');
    /*var emailchek= $(this).closest('tr').find('.emailChannel input:checkbox');*/
    /*var hosterlerscheck= $(this).closest('tr').find('.hosterlersChannel input:checkbox');*/
    var pushchek= $(this).closest('tr').find('.pushChannel input:checkbox');
    var radios1= $(this).closest('tr').find('.radiovalue input[type=radio]:checked');
    var featureId =$(this).closest('tr').find('.featureId input:text');
    var channelFeatureObjs =[];
    /*featureObj1.email = emailchek[i].checked,*/
    for (var i =0; i < featureId.length; i++) {
        var featureObj1 ={};
        featureObj1.featureId =featureId[i].value,
            featureObj1.sms = smschek[i].checked,
            featureObj1.push = pushchek[i].checked,
            /*featureObj1.notifyHostelers = hosterlerscheck[i].checked,*/
            featureObj1.isOverride =radios1[i].value;
        channelFeatureObjs.push(featureObj1);
    }

    $('#updateButton').val(JSON.stringify(channelFeatureObjs));
    $('#updateButton').click();
});

$(document).on('click','#promoteStud',function(){
    var sectionObjs = [];
    var existingSec = [];
    var promotedSec = [];
    var onlyCureSecObj = [];
    var onlyPromSecObj = [];
    var sectionValues = {};
    $('#promoteStudentTable tr').each(function() {
        var sectionObj = {};
        var postSection = $(this).find(".postSection :selected").val();
        var curSectionId = $(this).find(".curSectionId").val();
        var curSectionName = $(this).find(".curSection").val();
        var postSection1 = $(this).find(".postSection :selected").text();
        if(postSection != undefined) {
            sectionObj['sectionId'] = postSection;
            sectionObj['sectionName'] = postSection1;
            sectionObj['id'] = curSectionId;
            sectionObj['name'] = curSectionName;
            existingSec.push({"id": curSectionId, "name": curSectionName});
            promotedSec.push({"id": postSection, "name": postSection1});
            onlyCureSecObj.push(curSectionId);
            onlyPromSecObj.push(postSection);
            sectionObjs.push(sectionObj);
        }
    });
    sectionValues.existingSec = existingSec;
    sectionValues.sectionObjs = sectionObjs;
    sectionValues.promotedSec = promotedSec;
    sectionValues.onlyCureSecObj = onlyCureSecObj;
    sectionValues.onlyPromSecObj = onlyPromSecObj;
    $('#promoteUpdateStud').val(JSON.stringify(sectionValues));
    $('#promoteUpdateStud').click();
});



$(document).on('change','input.input-small',function(){
    var node = $(this)[0].parentNode.parentNode.parentNode.id;
    if(node != "") {
        var id = ($(this)[0].id).split('_');
        var num = parseInt(id[1]);
        $('#'+ id[0]+ '_' + (num + 2)).val($(this)[0].value);
    }

});

$(document).on('click','.applyBtn',function(){
    $('#getDataByDuration').trigger('click');
});

$(document).on('click','a#deleteAttachment', function(){
    var attachmentKey = $(this).closest('tr').find('.deleteAtta input:text');
    $('#confirmAttachment').val(attachmentKey[0].value);
    $('#deleteButton').val('attachment', true);
    $('#deleteButton').val('');
    $('#attachmentWarning').click();
});

function enablePopOver(id, title, content, placement) {
    $(id).popover({
        trigger: 'manual',
        html: true,
        title: title + '<a class="popover-close cd-panel-close">Close</a>',
        placement: placement,
        toggle : 'popover',
        content: content,
        template: '<div class="popover popover-width350 border-info"><div class="arrow"></div><h3 class="popover-title nsa-bg-primary"></h3><div class="popover-content"></div></div>'
    });
    $(id).popover('show');
    $(id).popover().on('shown.bs.popover', function () {
        var $popup = $(this);
        $(this).next('.popover').find('.popover-close').click(function (e) {
            $popup.popover('hide');
        });
    });
}
window.enablePopOver = enablePopOver;
function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
window.generateRandomString = generateRandomString;

function getAudioRecorder() {
    return new MP3Recorder( { bitRate: 128 } );
}

function getRecordedAudio(recorder, audioId, success, error) {
    recorder.getMp3Blob(function (blob) {
        blobToDataURL(blob, function(url) {
            var audio = document.getElementById(audioId);
            audio.src = url;
            audio.load();
            success(blob, url);
        });
    }, function (e) {
        console.log(e);
        error(e);
    });
}

function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function (e) {
        callback(e.target.result);
    }
    a.readAsDataURL(blob);
}

$(document).on('change','input.input-small',function(){
    var node = $(this)[0].parentNode.parentNode.parentNode.id;
    if(node != "") {
        var id = ($(this)[0].id).split('_');
        var num = parseInt(id[1]);
        $('#'+ id[0]+ '_' + (num + 2)).val($(this)[0].value);
    }
});

$(document).on('mouseover', '.lg-object', function(e) {
    $('.lg-outer').removeClass('lg-thumb-open')
    e.preventDefault()
});

$(document).on('mouseout', '.lg-object', function(e) {
    $('.lg-outer').addClass('lg-thumb-open')
    e.preventDefault()
});

function downloadFile(options, cb) {
    var xhr = new XMLHttpRequest(),
        url = options.url,
        type = options.type,
        dataType = options.responseType || "blob", // blob or arraybuffer. Default is blob
        data = options.data || null;
    xhr.onreadystatechange = function(){
        if ( xhr.readyState == 4 ) {
            if ( xhr.status == 200 ) {
                var data = {};
                data[options.dataType] = xhr.response;
                var filename = xhr.getResponseHeader("EFILENAME")
                // make callback and send data
                var binaryData = [];
                binaryData.push(xhr.response);
                var blob = new Blob(binaryData, {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                blob.name = filename;
                var downloadUrl = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                if(document.body != null){
                    document.body.appendChild(link);
                }
                link.href = downloadUrl;
                link.download = filename;
                link.click();
            } else {
                var reader = new FileReader();
                reader.addEventListener("loadend", function() {
                    var arr = new Uint8Array(reader.result);
                    var str = String.fromCharCode.apply(String, arr); // reader.result contains the contents of blob as a typed array
                    var formateStr = JSON.parse(str);
                    return showNotification(formateStr.data.message,"",'bg-danger')
                });
                reader.readAsArrayBuffer(xhr.response);

            }
        }
    };
    xhr.open(type, url, true);
    xhr.setRequestHeader('session-id', options.headers['session-id']);
    xhr.setRequestHeader('id', options.headers.id);
    xhr.setRequestHeader('academicyear', options.headers['academicYear']);
    xhr.responseType = dataType;
    xhr.send(data);
}

function isCurrentYear() {
    return localStorage.getItem("cyear") === "true" ? true : false
}
