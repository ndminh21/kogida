import { Exercise } from './../../model/Exercise';
import { Authentication } from './../authentication/authentication';
import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import SubjectService from '../../service/database/SubjectService';
import ChapterService from '../../service/database/ChapterService';
import ExerciseService from '../../service/database/ExerciseService';
import { Chapter } from '../../model/Chapter';
import SolutionService from '../../service/math/SolutionService'
import Parse from '../../service/math/Parse';
import GrammarService from '../../service/grammar/GrammarService';
export default class ExerciseViewInDetailsController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let chapterService: ChapterService = new ChapterService();
        let exerciseService: ExerciseService = new ExerciseService();
        let authentication = new  Authentication();

        router.get("/xem-chi-tiet-bai-tap/:exerciseid", async function (req: Request, res: Response) {
            const exerciseId: number = req.params["exerciseid"];
            const page: number = req.params["page"];
            
            res.render("../module/exercise-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                exercise: await exerciseService.getById(exerciseId)
            });
        });

        router.get("/giai-bai-tap-theo-tham-so", async function (req: Request, res: Response) {
            const exerciseId: number = req.query["mabaitap"];
            const values: Array<string> = JSON.parse(req.query["thamso"]);
            const exercise: Exercise = <Exercise> await exerciseService.getById(exerciseId);
            
            if (exercise.SolutionList.length <= 0)
            {
                res.render("../module/exercise-view-in-details/view", {
                    gradeList: await gradeService.findAll(),
                    exercise:  exercise, // Exercise with solved solution
                    parameterValues: values,
                    show: true
                });
                return false;
            }

            var sympyList = await SolutionService.getSympyAndVariable(exercise.toJSON().SolutionList);
            const arrKeyTex = JSON.parse(exercise.toJSON().Parameter);
            sympyList.KeyArr = []
            for(var i = 0; i < values.length; i++){
                if(arrKeyTex[i].tex.indexOf("subscript") < 0){
                    var keyTree = await GrammarService.getTreeFromLatex(arrKeyTex[i].tex)
                    sympyList.KeyArr.push(Parse.parseToSymPyRad(keyTree))
                }else{
                    let index = sympyList.texList.findIndex(x => x.tex == arrKeyTex[i].tex)
                    sympyList.KeyArr.push(sympyList.texList[index].variables)
                }
                var valueTree = await GrammarService.getTreeFromLatex(values[i])
                sympyList.ValueArr.push(Parse.parseToSymPyRad(valueTree))
            }
            let result = null;
            result =  await SolutionService.Solve(sympyList)
            const cheerio = require('cheerio')
            var solutionList = exercise.toJSON().SolutionList 
            for (var i = 0; i < solutionList.length; i++){
                var solution = solutionList[i]
                const $ = cheerio.load(solution.Content, { xmlMode: true })
                for (var j = 0; j < $('span').length; j++) {
                    var formularIndex = parseInt($('span').eq(j).attr('formula'))
                    switch($('span').eq(j).attr('format')){
                        case "1":
                            $('span').eq(j).html('\\(' +result[i][formularIndex].format1 + '\\)')
                            break;
                        case "2":
                            $('span').eq(j).html('\\(' + result[i][formularIndex].format2 + '\\)')
                            break;    
                        case "3":
                            $('span').eq(j).html('\\(' + result[i][formularIndex].format3 + '\\)')
                            break;    
                        case "4":
                            $('span').eq(j).html('\\(' + result[i][formularIndex].format4 + '\\)')
                            break;    
                    }
                }
                var exReturn = exercise.toJSON()
                exReturn.SolutionList[i].Content = $.html()
            }
            
            res.render("../module/exercise-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                exercise:  exReturn, // Exercise with solved solution
                parameterValues: values,
                show: true
            });
        });
    }
}
