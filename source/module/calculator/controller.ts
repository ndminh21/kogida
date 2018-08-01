import { Router, Request, Response } from 'express';
import CalculatorService from '../../service/math/CalculatorService'
import PolynomialService from '../../service/math/PolynomialService'
import PolymialInequationService from '../../service/math/PolymialInequationService'
import GradeService from '../../service/database/GradeService'
import KogidaTree from '../../service/math/Tree'
import Parse from '../../service/math/Parse'
import GrammarService from "../../service/grammar/GrammarService";
export default class CalculatorController {
    public static route(router: Router) {
        var gradeService: GradeService = new GradeService();
        
        router.get("/may-tinh-kogida", async function (req: Request, res: Response) {
            res.render("../module/calculator/view", {
                editor: req.query.editor != undefined ? (req.query.editor === "true") : false,
                solver: req.query.solver != undefined ? (req.query.solver === "true") : false
            });
        });

        router.get("/may-tinh-truc-tiep-kogida", async function (req: Request, res: Response) {
            res.render("../module/calculator/direct", {
                gradeList: await gradeService.findAll(),
                editor: req.query.editor != undefined ? (req.query.editor === "true") : false,
                solver: req.query.solver != undefined ? (req.query.solver === "true") : false
            });
        });

        router.post("/tinh-toan", async function (req: Request, res: Response) {
            var data = req.body
            var tree = await GrammarService.getTreeFromLatex(data.latexString)
            var Tree = new KogidaTree(tree)
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index).map(x => x.trim().replace("\\", "").replace("subscript{", "").replace("}{", "_").replace("}", ""))
            let inequation = ["LtEq", "GtEq", "LeqEq", "GeqEq"]
            if (data.variables)    
                data.variables = data.variables.map(x => x.trim().replace("\\", ""))    
            if (Tree.getRootOperation() == "EqSys") {
                let isLinear = tree.children.map(x => Parse.checkIsLinear(x)).filter(y => y === false);
                var result = await PolynomialService.solveSystem(tree, variablesJSON, data.variables,data.angleMode,data.numberMode)
                res.send(result)
            }
            else if (Tree.getRootOperation() == "Eq"){
               var result = await PolynomialService.solveSimply(tree, variablesJSON, data.variables, data.angleMode, data.numberMode )
               res.send(result)
            }
            else if (inequation.indexOf(Tree.getRootOperation()) != -1){
                var result = await PolymialInequationService.solveSimply(tree, variablesJSON, data.variables)
                res.send(result)
            }
            else{
                
                if (data.variables) {
                    data.variables = data.variables.map(x => x.trim().replace("\\", "").replace("subscript{", "").replace("}{", "_").replace("}", ""))
                }
                
                if(data.angleMode === "deg")    
                    var sympyStr = Parse.parseToSymPyDegree(tree)
                else
                    var sympyStr = Parse.parseToSymPyRad(tree)
                
                var result = await CalculatorService.calculator(sympyStr, variablesJSON) 
                res.send(result)
            }   
        });
    }
}
