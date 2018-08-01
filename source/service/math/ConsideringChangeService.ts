import * as PS from 'python-shell'
import Application from "./../../Application"
export default class ConsideringChangeService {

    constructor() {
    }

    public sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async getConsideringChange(fnc,conditionLeq,conditionEq,xmax,xmin,open_left,open_right) {
        return new Promise(function (resolve, reject) {
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('considering_change.py', options as PS.InstanceOptions);

            var dataToSend = { function : fnc,conditionEq:conditionEq,conditionLeq:conditionLeq, xmax: xmax, xmin : xmin, open_left : open_left, open_right:open_right };

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
