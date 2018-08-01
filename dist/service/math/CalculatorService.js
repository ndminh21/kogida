"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./../../Application");
const GrammarService_1 = require("../grammar/GrammarService");
const Tree_js_1 = require("./Tree.js");
const Parse_1 = require("./Parse");
class CalculatorService {
    constructor() {
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async calculator(sympy, varialbleList = []) {
        return new Promise(function (resolve, reject) {
            let result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('calculator.py', options);
            var dataToSend = {
                sympy: sympy,
                varList: varialbleList.map(x => x.trim().replace("\\", ""))
            };
            console.log(dataToSend);
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                resolve((JSON.parse(message)));
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
    static async calculate(sympy, varialbleList = []) {
        return new Promise(function (resolve, reject) {
            let result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('calculator.py', options);
            var dataToSend = {
                sympy: sympy,
                varList: varialbleList.map(x => x.trim().replace("\\", ""))
            };
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                resolve((JSON.parse(message)).beauty);
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
    static async calculate1(latex, angleMode) {
        return new Promise(async function (resolve, reject) {
            var tree = await GrammarService_1.default.getTreeFromLatex(latex);
            var Tree = new Tree_js_1.default(tree);
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index);
            if (angleMode === "deg")
                var sympy = Parse_1.default.parseToSymPyDegree(tree);
            else
                var sympy = Parse_1.default.parseToSymPyRad(tree);
            let result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('calculator.py', options);
            var dataToSend = {
                sympy: sympy,
                varList: variablesJSON.map(x => x.trim().replace("\\", ""))
            };
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                resolve((JSON.parse(message)).beauty);
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
exports.default = CalculatorService;
