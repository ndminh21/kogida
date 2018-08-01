import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import GrammarService  from '../../service/grammar/GrammarService'
import Parse from '../../service/math/Parse'
import FindMinMaxService from '../../service/math/FindMinMaxService'
import TexGenerator from '../../service/result/TexGenerator';
import TexRender from '../../service/result/TexRender';

export default class FunctionExplorerController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();

        router.get("/tim-gtln-gtnn-tren-doan", async function (req: Request, res: Response) {
            
            res.render("../module/minmax/view", {
                gradeList: await gradeService.findAll(),
                functionTex: null,
                xmin: "-1",
                xmax: "1",
                set: "closed",
                result: null
            });
        });

        router.get("/tim-gtln-gtnn-tren-khoang", async function (req: Request, res: Response) {
            
            res.render("../module/minmax/view", {
                gradeList: await gradeService.findAll(),
                functionTex: null,
                xmin: "-1",
                xmax: "1",
                set: "open",
                result: null
            });
        });

        router.get("/giai-tim-gtln-gtnn-tren-doan", async function(req: Request, res: Response) {
            var functionTex = req.query["tex"];
            var xmin = req.query["xmin"];
            var xmax = req.query["xmax"];
            var xminTree = await GrammarService.getTreeFromLatex(xmin)
            var xmaxTree = await GrammarService.getTreeFromLatex(xmax)
            var functionTree = await GrammarService.getTreeFromLatex(functionTex)    
            var functionSympy = Parse.parseToSymPyRad(functionTree)
            var xminSympy = Parse.parseToSymPyRad(xminTree)
            var xmaxSympy = Parse.parseToSymPyRad(xmaxTree)
            var conditionStr = Parse.getConditions(functionTree)
            var result : Object = null
            if(conditionStr.indexOf("nosupport") >= 0){
                result = {
                    message : "invalid"
                }
            }
            else{
                var conditions = conditionStr.split(";").filter(x => x != "")
                var conditionsLeq = conditions.filter(x => x.indexOf("Eq") < 0)
                var conditionsEq = conditions.filter(x => x.indexOf("Eq") >= 0)
                result = await FindMinMaxService.findMinMax(functionSympy, conditionsLeq, conditionsEq, xminSympy, xmaxSympy)
            }    
            console.log(result)
            
            res.render("../module/minmax/view", {
                gradeList: await gradeService.findAll(),
                functionTex: functionTex,
                xmin: xmin,
                xmax: xmax,
                set: "closed",
                result: result
            });
        });

        router.get("/giai-tim-gtln-gtnn-tren-khoang", async function(req: Request, res: Response) {
            var functionTex = req.query["tex"];
            var xmin = req.query["xmin"];
            var xmax = req.query["xmax"];
            var option = req.query["option"]; //left, right, full

            var xminTree = await GrammarService.getTreeFromLatex(xmin)
            var xmaxTree = await GrammarService.getTreeFromLatex(xmax)
            var functionTree = await GrammarService.getTreeFromLatex(functionTex)
            var functionSympy = Parse.parseToSymPyRad(functionTree)
            var xminSympy = Parse.parseToSymPyRad(xminTree)
            var xmaxSympy = Parse.parseToSymPyRad(xmaxTree)
            var conditionStr = Parse.getConditions(functionTree)
            var result: Object = null
            if (conditionStr.indexOf("nosupport") >= 0) {
                result = {
                    message: "invalid"
                }
            }
            else {
                var conditions = conditionStr.split(";").filter(x => x != "")
                var conditionsLeq = conditions.filter(x => x.indexOf("Eq") < 0)
                var conditionsEq = conditions.filter(x => x.indexOf("Eq") >= 0)
                result = await FindMinMaxService.findMinMaxOpenSet(functionSympy, conditionsLeq, conditionsEq, xminSympy, xmaxSympy,option)
                
            }
            console.log(result)
        
            res.render("../module/minmax/view", {
                gradeList: await gradeService.findAll(),
                functionTex: functionTex,
                xmin: xmin,
                xmax: xmax,
                set: "open",
                result: result
            });
        });

        

        
    }


}
