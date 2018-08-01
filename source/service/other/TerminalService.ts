export default class TerminalService {

    constructor() {
    }

    public async execTerminal(data:string) {
        return new Promise(function (resolve, reject) {
            var cmd = require('node-cmd')
            cmd.get(
                data,
                function (err, data, stderr) {
                    if(err)
                        reject(err)
                    else
                        resolve(data)    
                }
            );
        })
    }
}