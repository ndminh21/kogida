"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("./../../Application");
class DiagramService {
    constructor() {
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async getBase64(diagramInput, classification) {
        return new Promise(function (resolve, reject) {
            var result = [];
            var options = {
                scriptPath: Application_1.default.SERVICE_DIR + '/math/Solver'
            };
            var PythonShell = require('python-shell');
            var pyshell = new PythonShell('TexDiagram.py', options);
            var dataToSend = { diagramInput, classification };
            pyshell.send(JSON.stringify(dataToSend));
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
}
exports.default = DiagramService;
