"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./../../Application");
const Parse_1 = require("./Parse");
class PolymialInequationService {
    constructor() {
    }
    static async solveSimply(tree, varList, varNeedCal) {
        return new Promise(function (resolve, reject) {
            var result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('inequation_solveSimply.py', options);
            var sympyStr = Parse_1.default.parseToSymPyDegree(tree);
            var dataToSend = { sympy: sympyStr, varList: varList };
            console.log(dataToSend);
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
    static async solveSimplySBS(tree, varList, varNeedCal) {
        return new Promise(function (resolve, reject) {
            var parse = new Parse_1.default();
            var result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('INEQ_SBS.py', options);
            var sympyStr = Parse_1.default.parseToSymPyDegreeEq(tree);
            var dataToSend = { sympy: sympyStr, varList: varList };
            console.log(dataToSend);
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
exports.default = PolymialInequationService;
