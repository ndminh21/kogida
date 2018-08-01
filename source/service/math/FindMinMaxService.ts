import * as PS from 'python-shell'
import Application from "./../../Application"
export default class FindMinMaxService {

    constructor() {
    }

    public sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async findMinMax(fnc,conditionLeq,conditionEq,xmin,xmax) {
        return new Promise(function (resolve, reject) {
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('findMinMax.py', options as PS.InstanceOptions);
            
            var dataToSend = { function : fnc,conditionLeq:conditionLeq,conditionEq:conditionEq,xmin:xmin,xmax:xmax };

            pyshell.send(JSON.stringify(dataToSend));
            console.log(dataToSend)
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

    public static async findMinMaxOpenSet(fnc, conditionLeq, conditionEq, xmin, xmax,option) {
        return new Promise(function (resolve, reject) {
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('findMinMaxOpenSet.py', options as PS.InstanceOptions);

            var dataToSend = { function: fnc, conditionLeq: conditionLeq, conditionEq: conditionEq, xmin: xmin, xmax: xmax, option : option };

            pyshell.send(JSON.stringify(dataToSend));
            console.log(dataToSend)
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
