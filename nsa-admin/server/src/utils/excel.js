/**
 * Created by bharatkumarr on 16/10/17.
 */

var Excel = require('exceljs');


exports.fonts = {
        arialWhiteUI12: { name: 'Arial Black', family: 2, size: 12, bold: true, underline: false, italic: false, color: {argb: 'ffffff'} },
        arialBlackUI12: { name: 'Arial Black', family: 2, size: 12, bold: true, underline: false, italic: false, color: {argb: '000000'} },
        arial12: { name: 'Arial', size: 12},
        comicSansUdB16: { name: 'Comic Sans MS', family: 4, size: 16, bold: true }
    };

exports.alignments = {
    left_top: {horizontal: 'left', vertical: 'top', wrapText: true },
    center: { horizontal: 'center', vertical: 'middle', wrapText: true },
    left: { horizontal: 'left', vertical: 'middle' },
    right: { horizontal: 'right', vertical: 'middle' },
}

exports.fills = {
    solidBlack: {type: "pattern", pattern:"solid", fgColor:{argb:"000000"}},
    solidYellow: {type: "pattern", pattern:"solid", fgColor:{argb:"FFFF00"}},
    redDarkVertical: {type: "pattern", pattern:"darkVertical", fgColor:{argb:"FFFF0000"}},
    redGreenDarkTrellis: {type: "pattern", pattern:"darkTrellis", fgColor:{argb:"FFFF0000"}, bgColor:{argb:"FF00FF00"}},
    blueWhiteHGrad: {type: "gradient", gradient: "angle", degree: 0,
        stops: [{position:0, color:{argb:"FF0000FF"}},{position:1, color:{argb:"FFFFFFFF"}}]},
    rgbPathGrad: {type: "gradient", gradient: "path", center:{left:0.5,top:0.5},
        stops: [{position:0, color:{argb:"FFFF0000"}},{position:0.5, color:{argb:"FF00FF00"}},{position:1, color:{argb:"FF0000FF"}}]}
};


exports.createWorkBook = function (req, data) {
    var workbook = new Excel.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(2017, 10, 16);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2017, 10, 16);
    workbook.properties.date1904 = true;
    workbook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
    ];
    return workbook;
}


exports.createWorkSheet = function (workbook, name) {
    return workbook.addWorksheet(name, {properties:{tabColor:{argb:'4FA0E2'}}} );
}

exports.getWorkSheet = function(part, callback) {
    var inboundWorkbook = new Excel.Workbook();
    inboundWorkbook.xlsx.read(part).then(function() {
        var inboundWorksheet = inboundWorkbook.getWorksheet(1); //or name of the worksheet
        inboundWorksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        });
        callback(inboundWorksheet, inboundWorkbook);

    });
}
