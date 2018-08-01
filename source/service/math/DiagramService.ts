import * as PS from 'python-shell'
import Application from "./../../Application"
export default class DiagramService {

    constructor() {
    }

    public sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static async getBase64(diagramInput, classification) {
        return new Promise(function (resolve, reject) {
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('TexDiagram.py', options as PS.InstanceOptions);

            var dataToSend = { diagramInput, classification };

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
