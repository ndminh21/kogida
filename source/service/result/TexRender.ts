import * as PS from 'python-shell'
import Application from "./../../Application"
import TexGenerator from './TexGenerator';

export default class TexRender {
    public static async fromEquationSBSResultElementToTex(element: Object, variable: String): Promise<String> {
        if (element.hasOwnProperty("eq"))
            return Promise.resolve("eq;" + element["eq"]["val"]);
        else if ( element.hasOwnProperty("ineq"))
            return Promise.resolve("ineq;" + element["ineq"]["val"]);
        else if (element.hasOwnProperty("or")) {
            var result = "\\left[\\begin{array}{l}";
            for (let index = 0; index < element["or"].length; index++) {
                const elem = element["or"][index];
                result += await TexRender.fromEquationSBSResultElementToTex(elem, variable);
                result += "\\\\";
            }
            result += "\\end{array}\\right.";
            return Promise.resolve("or;" + result);
        }
        else if (element.hasOwnProperty("considering_sign"))
        {
            let texString: String = TexGenerator.GenerateConsideringSignTable(<Array<String>> element["considering_sign"]["val"], <Array<String>> element["considering_sign"]["sign"], variable);
            let base64: String = <String> await TexRender.ToBase64(texString);
            return Promise.resolve(`image;${base64}`);
        }
        else if (element.hasOwnProperty("val")){
            if (element["val"] == "null") {
                return Promise.resolve("noroot;");                
            }
        }
    }

    public static async fromEquationSBSResultToTex(result: Array<Object>, variable: String): Promise<Array<String>> {
        var renderedArray: Array<String> = [];
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            renderedArray.push(await TexRender.fromEquationSBSResultElementToTex(element, variable));
        }
        return Promise.resolve(renderedArray);
    }

    public static fromEqSysSBSResultToTex(result: Array<Object>, variables: Array<string>) {
        var stepList = [];
        for (let i = 0; i < result.length; i++) {
            const step: Array<Object> = <Array<Object>> result[i]["and"];
            let latexStep = {
                and: []
            };
            
            for (let j = 0; j < step.length; j++) {
                const row: Array<string> = <Array<string>> step[j];
                let latexRow = "";
                let flag = true;
                for (let k = 0; k < row.length; k++) {
                    const cell: string = row[k];
                    if (k < row.length - 1) {
                        if (cell.indexOf("\\") >= 0)
                        {
                            if ((cell.indexOf("\\") != cell.lastIndexOf("\\")) || (cell.indexOf("\\") != cell.lastIndexOf("\\") && cell[cell.length - 1] != "}"))
                                latexRow += ((flag ? "" : "+") + `(${cell})` + variables[k]);
                            else {
                                if (cell.charAt(0) != "-")
                                    latexRow += ((k == 0 ? "" : (flag ? "" : "+")) + `${cell}` + variables[k]);
                                else
                                    latexRow += (`${cell}` + variables[k])
                            }
                        }
                        else {
                            if (cell === "0") {}
                            else if (cell === "1")
                                latexRow += ((k == 0 ? "" : (flag ? "" : "+")) + variables[k]);
                            else if (cell === "-1")
                                latexRow += ("-" + variables[k]);
                            else
                                latexRow += ((cell.charAt(0) == "-" ? cell : ((k == 0 ? "" : (flag ? "" : "+")) + cell) ) + variables[k]);
                        }
                    }
                    else
                        latexRow += `=${cell}`
                    if (cell != "0") flag = false;
                }
                latexStep.and.push({
                    eq: {
                        val: latexRow
                    }
                });
            }
            if (i == 0){
                stepList.push({
                    start: latexStep
                });
            }
            else
                stepList.push(latexStep);
        }
        return stepList;
    }

    public static async ToBase64(latexStr: String) {
        return new Promise(function(resolve,reject) {
            var result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell =  new PythonShell('converter.py', options as PS.InstanceOptions);

            var dataToSend = {tex: latexStr};

            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                resolve(message.toString());
            });

            pyshell.end(function (err) {
                if (err){
                    reject(err);
                };
            });
        });
    }

    public static FromSetRecursive(set: Object) {
        if (set.hasOwnProperty("open_set"))
            return `\\left(${set["open_set"]["min"]}, ${set["open_set"]["max"]}\\right)`;
        else if (set.hasOwnProperty("closed_set"))
        {
            return `\\left[${set["closed_set"]["min"]}, ${set["closed_set"]["max"]}\\right]`;            
        }
        else if (set.hasOwnProperty("left_open_set"))
            return `\\left(${set["left_open_set"]["min"]}, ${set["left_open_set"]["max"]}\\right]`;
        else if (set.hasOwnProperty("right_open_set"))
            return `\\left[${set["right_open_set"]["min"]}, ${set["right_open_set"]["max"]}\\right)`;
        else if (set.hasOwnProperty("unions"))
        {
            var subsets = (<Array<Object>> set["unions"]).map((x) => TexRender.FromSetRecursive(x)).reduce((prev, curr) => prev + "\\cup" + curr);
            return `\\left(${subsets}\\right)`;
        }
        else if (set.hasOwnProperty("intersections"))
        {
            var subsets = (<Array<Object>> set["intersections"]).map((x) => TexRender.FromSetRecursive(x)).reduce((prev, curr) => prev + "\\cap" + curr);
            return `\\left(${subsets}\\right)`
        }
    }

    public static FromSet(set: Object){
        return TexRender.FromSetRecursive(set);
    }
}