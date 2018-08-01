import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import SubjectService from '../../service/database/SubjectService';
import ChapterService from '../../service/database/ChapterService';
import ExerciseService from '../../service/database/ExerciseService';
import { Chapter } from '../../model/Chapter';
import GrammarService  from '../../service/grammar/GrammarService'
import KogidaTree from '../../service/math/Tree'
import FunctionExplorerService from '../../service/math/FunctionExplorerService'
import TexGenerator from '../../service/result/TexGenerator';
import TexRender from '../../service/result/TexRender';
import DiagramService from "../../service/math/DiagramService";
import Parse from '../../service/math/Parse';

export default class FunctionDrawController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();

        router.get("/hinh-ve-do-thi-bat-ki", async function(req: Request, res: Response) {
            var functionTex = req.query["tex"];
            var xmin = req.query["xmin"];
            var ymin = req.query["ymin"];
            var xmax = req.query["xmax"];
            var ymax = req.query["ymax"];
            var functionTree = await GrammarService.getTreeFromLatex(functionTex);
            var functionExpr = Parse.parseToLatexExpr(functionTree);
            var message = null
            if (functionExpr.indexOf("nosupport") < 0 ){
                var data = {
                    xminTree: await GrammarService.getTreeFromLatex(xmin),
                    xmaxTree: await GrammarService.getTreeFromLatex(xmax),
                    yminTree: await GrammarService.getTreeFromLatex(ymin),
                    ymaxTree: await GrammarService.getTreeFromLatex(ymax)
                }
                var result: any = await FunctionExplorerService.FunctionExplorerAny(data)
                var message = result.message; // if xmin > xmax or ymin > ymax: message = "invalidrange" otherwise message = "valid"    
            }else
                message = "nosupport"
            

            res.render("../module/function-draw/view", {
                gradeList: await gradeService.findAll(),
                functionTex: functionTex,
                xmin: xmin,
                ymin: ymin,
                xmax: xmax,
                ymax: ymax,
                message: message
            });
        });

        router.get("/ve-do-thi-ham-so-bat-ki", async function(req: Request, res: Response) {
            var xmin = "-10";
            var ymin = "-10";
            var xmax = "10";
            var ymax = "10";

            res.render("../module/function-draw/view", {
                gradeList: await gradeService.findAll(),
                functionTex: null,
                xmin: xmin,
                ymin: ymin,
                xmax: xmax,
                ymax: ymax
            });
        })
    }


}
