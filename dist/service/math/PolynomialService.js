"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const Application_1 = require("./../../Application");
const Parse_1 = require("./Parse");
class PolynomialService {
    constructor() {
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async solveSimply(tree, varList, varNeedCal, angleMode, numberMode) {
        return new Promise(function (resolve, reject) {
            var result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            console.log(tree);
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('solveSimply.py', options);
            if (angleMode == "deg")
                var sympyStr = Parse_1.default.parseToSymPyDegreeEq(tree);
            else
                var sympyStr = Parse_1.default.parseToSymPyRadEq(tree);
            var dataToSend = { sympy: sympyStr, varList: varList, angleMode: angleMode, numberMode: numberMode };
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
    static async solveSimplyWithPrecision(sympyStr, precision) {
        return new Promise(function (resolve, reject) {
            var result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('solveSimplyWithPrecision.py', options);
            var dataToSend = { sympy: sympyStr, prec: precision };
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
    static async solveSimplySBSByChildProcess(sympyStr) {
        return new Promise(function (resolve, reject) {
            var scriptPath = Application_1.default.SERVICE_DIR + '/math/Solver/solveSimplySBS.py';
            var spawn = require("child_process").spawn;
            var process = spawn('python', [scriptPath, sympyStr]);
            process.stdout.on('data', function (data) {
                resolve(data.toString('utf8'));
            });
            process.stderr.on('data', (data) => {
                // As said before, convert the Uint8Array to a readable string.
                reject(data.toString('utf8'));
            });
        });
    }
    static async solveSimplySBS(tree, varList, varNeedCal, angleMode) {
        return new Promise(function (resolve, reject) {
            let result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('solveSimplySBS.py', options);
            if (angleMode == "deg")
                var sympyStr = Parse_1.default.parseToSymPyDegreeEq(tree);
            else
                var sympyStr = Parse_1.default.parseToSymPyRadEq(tree);
            var dataToSend = { sympy: sympyStr, varList: varList, angleMode: angleMode };
            pyshell.send(JSON.stringify(dataToSend));
            console.log(tree.children[0]);
            console.log(dataToSend);
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
    static async solveSystem(tree, varList, varNeedCal, angleMode, numberMode) {
        return new Promise(function (resolve, reject) {
            var parse = new Parse_1.default();
            var start = new Date();
            let result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('solveSystem.py', options);
            var nonlinsolve = 'result = nonlinsolve([';
            if (angleMode == "rad")
                tree.children.map(x => { nonlinsolve += Parse_1.default.parseToSymPyRad(x) + ','; });
            else
                tree.children.map(x => { nonlinsolve += Parse_1.default.parseToSymPyDegree(x) + ','; });
            nonlinsolve += '],[';
            varNeedCal.map(x => { nonlinsolve += x + ','; });
            nonlinsolve += '])';
            var dataToSend = { data: nonlinsolve, varList: varList, numberMode: numberMode };
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                var end = new Date();
                var time = moment(end).diff(start);
                resolve({ root: JSON.parse(message), time: time });
            });
            pyshell.end(function (err) {
                if (err) {
                    reject(err);
                }
                ;
            });
        });
    }
    static async solveSystemSBS(tree, varList, varNeedCal) {
        return new Promise(function (resolve, reject) {
            var parse = new Parse_1.default();
            var start = new Date();
            let result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var isLinear = tree.children.map(x => Parse_1.default.checkIsLinear(x)).filter(y => y == false);
            if (isLinear.length != 0) {
                var PythonShell = require('python-shell');
                var pyshell = new PythonShell('EQSYS.py', options);
                var sympyArr = tree.children.map(x => Parse_1.default.parseToSymPyRadEq(x));
                var dataToSend_Pi = { sympyArr: sympyArr, varNeedCal: varNeedCal };
                pyshell.send(JSON.stringify(dataToSend_Pi));
                console.log(dataToSend_Pi);
                pyshell.on('message', function (message) {
                    resolve(JSON.parse(message.toString()));
                });
                pyshell.end(function (err) {
                    if (err) {
                        reject(err);
                    }
                    ;
                });
            }
            else {
                var PythonShell = require('python-shell');
                var pyshell = new PythonShell('solveSystemSBS.py', options);
                var sympyArr = tree.children.map(x => Parse_1.default.parseToSymPyDegree(x));
                var dataToSend = { varList: varList, sympyArr: sympyArr, varNeedCal: varNeedCal };
                pyshell.send(JSON.stringify(dataToSend));
                pyshell.on('message', function (message) {
                    var end = new Date();
                    var time = moment(end).diff(start);
                    resolve({ root: JSON.parse(message), time: time, classification: "lineareqsys" });
                });
                pyshell.end(function (err) {
                    if (err) {
                        reject(err);
                    }
                    ;
                });
            }
        });
    }
    async latex2sympy(latex) {
        return new Promise(function (resolve, reject) {
            let result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('latex2sympy.py', options);
            var dataToSend = { latex2sympy: latex };
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                resolve((message));
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
exports.default = PolynomialService;
