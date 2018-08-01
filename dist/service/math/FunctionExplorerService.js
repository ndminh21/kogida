"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./../../Application");
const Parse_1 = require("./Parse");
class FunctionExplorerService {
    constructor() {
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async FunctionExplorer(tree, varList) {
        return new Promise(function (resolve, reject) {
            var result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var sympyStr = Parse_1.default.parseToSymPyRadEq(tree);
            let inequation = ["Eq", ">", ">=", "<", "<="];
            var check = true;
            inequation.map(x => {
                if (sympyStr.indexOf(x) >= 0)
                    check = false;
            });
            if (varList.filter(x => x != "x").length > 0)
                check = false;
            if (check) {
                var PythonShell = require('python-shell');
                var pyshell = new PythonShell('FE.py', options);
                var dataToSend = { expr: sympyStr, varList: varList };
                pyshell.send(JSON.stringify(dataToSend));
                pyshell.on('message', function (message) {
                    // received a message sent from the Python script (a simple "print" statement)
                    resolve(JSON.parse(message.toString()));
                });
                // end the input stream and allow the process to exit
                pyshell.end(function (err) {
                    if (err) {
                        reject(err);
                    }
                    ;
                });
            }
            else
                resolve({ result: null, classification: "invalid" });
        });
    }
    static async FunctionExplorerAny(data) {
        return new Promise(function (resolve, reject) {
            var result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('FE_Function.py', options);
            var dataSend = {};
            dataSend.xmin = Parse_1.default.parseToSymPyRad(data.xminTree);
            dataSend.xmax = Parse_1.default.parseToSymPyRad(data.xmaxTree);
            dataSend.ymin = Parse_1.default.parseToSymPyRad(data.yminTree);
            dataSend.ymax = Parse_1.default.parseToSymPyRad(data.ymaxTree);
            var dataToSend = { xy: dataSend };
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                resolve(JSON.parse(message.toString()));
            });
            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) {
                    reject(err);
                }
                ;
            });
        });
    }
}
exports.default = FunctionExplorerService;
