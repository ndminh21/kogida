import * as exceljs from 'exceljs'
import * as fs from 'fs'
import * as PS from 'python-shell'
import * as moment from 'moment'
import Application from "./../../Application"
import Parse from './Parse'
import Tree from './Tree'
import GrammarService from '../grammar/GrammarService';
export default class FunctionExplorerService {

    constructor() {
    }

    public sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async FunctionExplorer(tree, varList){
        return new Promise(function(resolve,reject){
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };
            var sympyStr = Parse.parseToSymPyRadEq(tree)
            let inequation = ["Eq", ">", ">=", "<", "<="]
            var check = true
            inequation.map(x => {
                if (sympyStr.indexOf(x) >= 0)
                    check = false
            })
            if (varList.filter(x => x != "x").length > 0)
                check = false
            if (check) {
                var PythonShell = require('python-shell');

                var pyshell = new PythonShell('FE.py', options as PS.InstanceOptions);


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
                    };
                });
            }else
                resolve({result : null,classification : "invalid"})
            
        })
    }

    public static async FunctionExplorerAny(data) {
        return new Promise(function (resolve, reject) {
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('FE_Function.py', options as PS.InstanceOptions);
            
            var dataSend: any = {}
            dataSend.xmin = Parse.parseToSymPyRad(data.xminTree);
            dataSend.xmax = Parse.parseToSymPyRad(data.xmaxTree);
            dataSend.ymin = Parse.parseToSymPyRad(data.yminTree);
            dataSend.ymax = Parse.parseToSymPyRad(data.ymaxTree);

            var dataToSend = { xy: dataSend};
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                resolve(JSON.parse(message.toString()));
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) {
                    reject(err);
                };
            });
        })
    }


}
