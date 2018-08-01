"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TerminalService {
    constructor() {
    }
    async execTerminal(data) {
        return new Promise(function (resolve, reject) {
            var cmd = require('node-cmd');
            cmd.get(data, function (err, data, stderr) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }
}
exports.default = TerminalService;
