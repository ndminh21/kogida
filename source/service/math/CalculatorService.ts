import * as exceljs from 'exceljs'
import * as fs from 'fs'
import * as PS from 'python-shell'
import Application from "./../../Application"
import GrammarService from '../grammar/GrammarService'
import KogidaTree from './Tree.js'
import Parse from './Parse'
export default class CalculatorService {

    constructor() {
    }

    public sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    public static  async calculator(sympy, varialbleList = []) {
        return new Promise(function (resolve, reject) {
            let result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('calculator.py', options as PS.InstanceOptions);
            var dataToSend = { 
                sympy: sympy,
                varList: varialbleList.map(x => x.trim().replace("\\", ""))
            };
            console.log(dataToSend)
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                resolve((JSON.parse(message)))
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) {
                    reject(err)
                };
            });
        })

    }

    public static async calculate(sympy, varialbleList = []) {
        return new Promise(function (resolve, reject) {
            let result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('calculator.py', options as PS.InstanceOptions);
            var dataToSend = {
                sympy: sympy,
                varList: varialbleList.map(x => x.trim().replace("\\", ""))
            };
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                resolve((JSON.parse(message)).beauty)
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) {
                    reject(err)
                };
            });
        })

    }

    public static async calculate1(latex,angleMode) {
        return new Promise(async function (resolve, reject) {
            var tree = await GrammarService.getTreeFromLatex(latex);
            var Tree = new KogidaTree(tree)
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index)
            if (angleMode === "deg")
                var sympy = Parse.parseToSymPyDegree(tree)
            else
                var sympy = Parse.parseToSymPyRad(tree)
            let result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('calculator.py', options as PS.InstanceOptions);
            var dataToSend = {
                sympy: sympy,
                varList: variablesJSON.map(x => x.trim().replace("\\", ""))
            };
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                resolve((JSON.parse(message)).beauty)
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) {
                    reject(err)
                };
            });
        })

    }
}
