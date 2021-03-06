"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs = require("exceljs");
const fs = require("fs");
class ExcelService {
    constructor() {
    }
    async convertToJSonWithoutHeader(filePath) {
        try {
            let result = [];
            if (fs.existsSync(filePath)) {
                var workbook = new exceljs.Workbook();
                await workbook.xlsx.readFile(filePath);
                var worksheet = workbook.getWorksheet(1);
                for (var i = 1; i <= worksheet.rowCount; i++) {
                    var row = worksheet.getRow(i);
                    result.push(row.values.slice(1));
                }
                return Promise.resolve(result);
            }
            else {
                return Promise.resolve([]);
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async convertToJSonWithHeader(filePath) {
        try {
            let result = [];
            if (fs.existsSync(filePath)) {
                var workbook = new exceljs.Workbook();
                await workbook.xlsx.readFile(filePath);
                var worksheet = workbook.getWorksheet(1);
                let rowResult = "";
                for (var i = 2; i <= worksheet.rowCount; i++) {
                    var row = worksheet.getRow(i);
                    row.values.slice(1);
                    var rowHeader = worksheet.getRow(1);
                    rowResult = "{";
                    for (var j = 1; j <= row.cellCount; j++) {
                        rowResult += ('"' + rowHeader.getCell(j).toString() + '"' + ":" + '"' + row.getCell(j).toString() + '",');
                    }
                    rowResult = rowResult.substring(0, rowResult.length - 1) + '}';
                    result.push(JSON.parse(rowResult.toString()));
                }
                return Promise.resolve(result);
            }
            else {
                return Promise.resolve([]);
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}
exports.default = ExcelService;
