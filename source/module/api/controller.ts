import { Authentication } from './../authentication/authentication';
import { Router, Request, Response } from 'express';
import ChapterService from '../../service/database/ChapterService';
import ExerciseService from '../../service/database/ExerciseService'
import Parse from '../../service/math/Parse'
import GrammarService from "../../service/grammar/GrammarService";
import KogidaTree from '../../service/math/Tree'
import SolutionService from '../../service/database/SolutionService'
import TexRender from "../../service/result/TexRender";
import TexGenerator from "../../service/result/TexGenerator";
import { Solution } from '../../model/Solution';
import DiagramService from '../../service/math/DiagramService';
import FindMinMaxService from '../../service/math/FindMinMaxService'
import ConsideringChangeService from '../../service/math/ConsideringChangeService'
import { createPool } from 'generic-pool';
import ExamService from '../../service/database/ExamService'
export default class APIController {
    public static route(router: Router) {
        let chapterSerive = new ChapterService()
        let exerciseService = new ExerciseService()
        let solutionService = new SolutionService()
        var elasticsearch = require('elasticsearch');
        var examService = new ExamService()
        router.post("/api/tim-kiem-chuong-theo-ma-phan-cong", async function(req: Request, res: Response) {
            var gradeSubjectId = req.body["gradeSubjectId"]
            var result = await chapterSerive.getByGradeSubjectId(gradeSubjectId)
            res.json(result)
        });

        router.get("/api/tim-kiem-bai-tap-theo-noi-dung", async function (req: Request, res: Response) {
            var content = req.query["content"]
            var ChapterId = req.query["chapterId"]
            var result = await exerciseService.searchExercise(content,ChapterId)
            res.json(result)
        });

        router.get("/api/xoa-bai-giai", async function (req: Request, res: Response) {
            var id = req.query["mabaigiai"]
            var result = await solutionService.delete(id)
            res.json(result)
        });

        router.get("/api/ve-bang-xet-dau", async function (req: Request, res: Response) {
            let values: Array<String> = req.query["values"];
            let signs: Array<String> = req.query["signs"];
            let variable: String = req.query["variable"];
            const result = {
                status: 200,
                base64: await TexRender.ToBase64(TexGenerator.GenerateConsideringSignTable(values, signs, variable))
            };
            res.json(result);
        });

        router.post("/api/ve-do-thi", async function (req: Request, res: Response) {
            var result = JSON.parse(req.body["result"]);
            var classification = req.body["classification"];
            var message: Object = null;
            var diagram : any = await DiagramService.getBase64(result["diagramInput"], classification)
            message = {
                status: 200,
                base64: diagram.base64
            }
            res.json(message);
        });

        router.post("/api/ve-do-thi-bat-ky", async function (req: Request, res: Response) {
            var classification = "nosupport";
            var xminTex = req.body["xmin"];
            var xmaxTex = req.body["xmax"];
            var yminTex = req.body["ymin"];
            var ymaxTex = req.body["ymax"];
            var functionTex = req.body["functionTex"];
            var result: any = {}
            var functionTree = await GrammarService.getTreeFromLatex(functionTex)
            result.latexExpr = Parse.parseToLatexExpr(functionTree);
            result.functionSympy = Parse.parseToSymPyRad(functionTree)
            var message: Object = null;
            if(result.latexExpr.indexOf("nosupport") < 0){
                var xminTree = await GrammarService.getTreeFromLatex(xminTex)
                var xmaxTree = await GrammarService.getTreeFromLatex(xmaxTex)
                var yminTree = await GrammarService.getTreeFromLatex(yminTex)
                var ymaxTree = await GrammarService.getTreeFromLatex(ymaxTex)

                result.xmin = Parse.parseToSymPyRad(xminTree);
                result.xmax = Parse.parseToSymPyRad(xmaxTree);
                result.ymin = Parse.parseToSymPyRad(yminTree);
                result.ymax = Parse.parseToSymPyRad(ymaxTree);
                
                message = await DiagramService.getBase64(result, classification)
                
            }else
                message = {
                    status: 202,
                    message : "nosupport"
                }
            console.log(message)    
            res.json(message);
        });
        
        router.get("/api/ve-bang-bien-thien", async function (req: Request, res: Response) {
            let functionTex: String = req.query["functionTex"];
            let xmin: String = req.query["xmin"];
            let xmax: String = req.query["xmax"];
            let open_left: String = req.query["open_left"];
            let open_right: String = req.query["open_right"];
            //functionTex = "\\power{x}{2}+x+1"
            //functionTex = "\\frac{\\plognepe{2}{x}}{x}"
            xmin = "-1"
            xmax = "1"
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
                result = await ConsideringChangeService.getConsideringChange(functionSympy,conditionsLeq,conditionsEq,xmaxSympy,xminSympy,true,true)
                var tex = TexGenerator.GenerateConsideringChangeTable(result["considering_change"])
                var base64 = await TexRender.ToBase64(tex)
            }
            result = {
                status: 200,
                base64: base64,
                consideringChange : result["considering_change"]
            };
            console.log(result)
            res.json(result);
        });

        router.get("/api/lay-cau-hoi", async function (req: Request, res: Response) {
            var madethi = req.query["ma"]
            var exam = await examService.getExamForTest(madethi)
            res.json({length: exam.length,exam : exam})
        })
    }
}
