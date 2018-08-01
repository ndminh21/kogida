import * as exceljs from 'exceljs'
import * as fs from 'fs'
import * as PS from 'python-shell'
import Application from "./../../Application"
import Parse from './Parse'

export default class PolymialInequationService {
    
    constructor() {
    }

    public static async solveSimply(tree, varList, varNeedCal){
        return new Promise(function(resolve,reject){
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');

            var pyshell =  new PythonShell('inequation_solveSimply.py', options as PS.InstanceOptions);
            var sympyStr = Parse.parseToSymPyDegree(tree)
            var dataToSend = {sympy : sympyStr, varList : varList};

            console.log(dataToSend);

            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                resolve(JSON.parse(message.toString()));
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err){
                    reject(err);
                };
            });
        })
    }

    public static async solveSimplySBS(tree, varList, varNeedCal){
        return new Promise(function(resolve,reject){
            var parse = new Parse()
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell =  new PythonShell('INEQ_SBS.py', options as PS.InstanceOptions);
            var sympyStr = Parse.parseToSymPyDegreeEq(tree)
            var dataToSend = {sympy : sympyStr, varList : varList};

            console.log(dataToSend);

            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                resolve(JSON.parse(message.toString()));
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err){
                    reject(err);
                };
            });
        })
    }


}