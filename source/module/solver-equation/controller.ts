import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import TexRender from "../../service/result/TexRender";
import PolynomialService from '../../service/math/PolynomialService'
import PolymialInequationService from '../../service/math/PolymialInequationService'
import KogidaTree from '../../service/math/Tree'
import GrammarService  from '../../service/grammar/GrammarService'

export default class SolverEquationController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        
        router.get("/giai-pt-hpt", async function (req: Request, res: Response) {
            res.render("../module/solver-equation/view", {
                gradeList: await gradeService.findAll(),
                tex: null,
                angleMode: null,
                variables: null,
                result: null             
            });
        });

        router.get("/cach-giai-pt-hpt", async function (req: Request, res: Response) {
            const tex = req.query["tex"];
            const angleMode = req.query["anglemode"];
            const variables = <Array<string>> JSON.parse(decodeURIComponent(req.query["variables"]));
            
            var jsonTree = await GrammarService.getTreeFromLatex(tex);
            var Tree = new KogidaTree(jsonTree);
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index);
            let inequation = ["LtEq", "GtEq", "LeqEq", "GeqEq"]
            let result_SBS: Object = null;
            
            if (Tree.getRootOperation() == "Eq"){
                result_SBS = <Object> await PolynomialService.solveSimplySBS(jsonTree, variablesJSON, variables, angleMode);
            }
            else if (inequation.indexOf(Tree.getRootOperation()) != -1){
                result_SBS = <Object> await PolymialInequationService.solveSimplySBS(jsonTree, variablesJSON, variables);
            }
            
            else if (Tree.getRootOperation() == "EqSys") {
                let rawResult = <Array<Object>> await PolynomialService.solveSystemSBS(jsonTree, variablesJSON, variables);
                result_SBS = new Object();
                
                if (rawResult["classification"] == "lineareqsys") {
                    result_SBS["category"] = "eqsys";
                    result_SBS["classification"] = "lineareqsys";
                    result_SBS["step"] = TexRender.fromEqSysSBSResultToTex(<Array<Object>> rawResult["root"], variables);
                    result_SBS["root"] = [rawResult["root"][rawResult["root"].length - 1]["and"].map((x) => x[x.length - 1])];
                }
                else  {
                    result_SBS = rawResult;
                }
            }else{
                result_SBS = new Object();
                result_SBS["category"] = "invalid";
            }

            res.render("../module/solver-equation/view", {
                gradeList: await gradeService.findAll(),
                tex: tex,
                angleMode: angleMode,
                variables: decodeURIComponent(req.query["variables"]),
                result: result_SBS // Result for response      
            });
        })
    }
}
