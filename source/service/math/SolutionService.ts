import GrammarService from '../grammar/GrammarService'
import KogidaTree from './Tree'
import Parse from './Parse'
import Application from "./../../Application"
import * as PS from 'python-shell'
export default class SolutionService {

    public static async Solve(data) {
        return new Promise(function(resolve,reject){
            let result = []
            var options = {
                scriptPath: Application.SERVICE_DIR + '/math/Solver'
            };

            var PythonShell = require('python-shell');

            var pyshell = new PythonShell('format_result.py', options as PS.InstanceOptions);

            var dataToSend = {data: data};
            pyshell.send(JSON.stringify(dataToSend));
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                resolve(JSON.parse(message.toString()));
            });

            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) {
                    reject(err)
                };
            });


        })
       
    } 

    public static async getSympyAndVariable(solutionList) {
        var result = [];
        var variablesList = []
        var texList = []
        for (var i = 0; i < solutionList.length; i++) {
            var solution = solutionList[i];
            var FormulaList: Array<any> = <Array<any>> JSON.parse(solution["Formula"]);
            var resultTemp = []
            for (var j = 0; j < FormulaList.length; j++) {
                var formula = FormulaList[j];
                var tex = formula["tex"];
                var tree = await GrammarService.getTreeFromLatex(tex)
                var Tree = new KogidaTree(await GrammarService.getTreeFromLatex(tex));
                let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index);
                let texJSON = Tree.findOutTexs()
                var lhs = ''
                var rhs = ''
                var mid = ''
                if (formula.angelmode === "rad") {
                    lhs = this.getLhs(tree.children[0], formula.angelmode)
                    mid = this.getMid(tree.children[0], formula.angelmode)
                    rhs = Parse.parseToSymPyForSolutionRad(tree.children[1])
                }
                else {
                    lhs = this.getLhs(tree.children[0], formula.angelmode)
                    mid = this.getMid(tree.children[0], formula.angelmode)
                    rhs = Parse.parseToSymPyForSolutionDegree(tree.children[1])
                }
                resultTemp.push({
                    lhs: lhs,
                    mid : mid,
                    rhs: rhs,
                    
                })
                variablesList = variablesList.concat(variablesJSON)
                texList = texList.concat(texJSON)
            }
            result.push(resultTemp)
        }
        return Promise.resolve({ result: result, variablesList: variablesList, texList: texList.filter(x => x.tex != undefined) ,KeyArr : [], ValueArr : [] });
    }    

    public static getLhs(tree, mode){
        if(tree.operation == "Eq")
            return this.getLhs(tree.children[0],mode)
        else{
            if(mode == 'rad')
                return Parse.parseToSymPyForSolutionRad(tree)   
            else
                return Parse.parseToSymPyForSolutionDegree(tree)       
        }
            
    }
    public static getMid(tree, mode) {
        if (tree.operation == "Eq")
            if (mode == 'rad')
                return Parse.parseToSymPyForSolutionRad(tree.children[1])
            else
                return Parse.parseToSymPyForSolutionDegree(tree.children[1])
        else {
            return ''
        }

    }

    
}