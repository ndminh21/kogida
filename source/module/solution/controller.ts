import { Router, Request, Response } from 'express';
import TexRender from "../../service/result/TexRender";
import PolynomialService from '../../service/math/PolynomialService'
import PolymialInequationService from '../../service/math/PolymialInequationService'
import KogidaTree from '../../service/math/Tree'
import GrammarService  from '../../service/grammar/GrammarService'
import GradeService from "../../service/database/GradeService"

export default class SolutionController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        
        router.get("/bai-giai-pt-hpt", async function (req: Request, res: Response) {
            
            var latexString = req.query.tex;
            var variables = req.query.variables;
            var angleMode = req.query.anglemode;
            var jsonTree = await GrammarService.getTreeFromLatex(latexString);
            var Tree = new KogidaTree(jsonTree);
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index);
            var jsonVariables = JSON.parse(variables);
            var input = ""
            let inequation = ["LtEq", "GtEq", "LeqEq", "GeqEq"]
            let result_SBS: Array<Object> = null;
            let resultToDisplay: Array<String>;
            let rootSetToDisplay: String = null;
            let neccessaryToClear: Boolean = false;
            let variable: String = null;

            if (Tree.getRootOperation() == "Eq"){
                result_SBS = <Array<Object>> await PolynomialService.solveSimplySBS(jsonTree, variablesJSON, variables, angleMode);
                input = "eq";
                resultToDisplay = <Array<String>> await TexRender.fromEquationSBSResultToTex(result_SBS, null);
            }
            else if (inequation.indexOf(Tree.getRootOperation()) != -1){
                result_SBS = <Array<Object>>await PolymialInequationService.solveSimplySBS(jsonTree, variablesJSON, variables)
                input = "ineq";
                variable = variablesJSON[0];                
                resultToDisplay = <Array<String>> await TexRender.fromEquationSBSResultToTex(result_SBS["step"], variable);
                rootSetToDisplay = TexRender.FromSet(result_SBS["result"]["rootset"]);
                if ((<Object>result_SBS["result"]["rootset"]).hasOwnProperty("unions") || (<Object>result_SBS["result"]["rootset"]).hasOwnProperty("intersections"))
                    neccessaryToClear = true;
            }
            else if (Tree.getRootOperation() == "EqSys") {
                result_SBS = <Array<Object>> await PolynomialService.solveSystemSBS(jsonTree, variablesJSON, jsonVariables)
                input = "eqsys";
                resultToDisplay = <Array<String>> TexRender.fromEqSysSBSResultToTex(result_SBS["root"], jsonVariables);
            }

            console.log(resultToDisplay);
            
            res.render("../module/solution/view", {
                gradeList: await gradeService.findAll(),
                result: resultToDisplay,
                rootset: rootSetToDisplay,
                input: input,
                neccessaryToClear: neccessaryToClear,
                variable: variable,
                tex: req.query.tex
            });
        });
    }
}
