import { Exercise } from './../../model/Exercise';
import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ExerciseService from '../../service/database/ExerciseService';
import ChapterService from '../../service/database/ChapterService';

export default class ExerciseInputController {
    public static route(router: Router): void {
        let authentication = new Authentication
        let gradeSubjectService : GradeSubjectService = new GradeSubjectService();
        let exerciseService : ExerciseService = new ExerciseService();
        let chapterService: ChapterService = new ChapterService();

        router.get("/them-bai-tap-moi", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            res.render("../module/admin-exercise-input/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll()
            });
        });

        router.get("/sua-de-bai", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            var exerciseId: number = <number>req.query["mabaitap"];
            var exercise: Exercise = <Exercise>await exerciseService.getById(exerciseId);

            res.render("../module/admin-exercise-input/view", {
                userInfo: req.user,
                exercise: exercise,
                chapterList: await chapterService.getByGradeSubjectId(exercise.Chapter.gradeSubject.Id),
                gradeSubjectList: await gradeSubjectService.findAll()
            });

            
        });

        router.post("/luu-sua-de", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            try {
                var newEx: any = {}
                var exerciseId = req.body["exerciseId"]
                newEx.ChapterId = <number>req.body["chapterId"];
                newEx.Content = req.body["content"];
                newEx.Parameter = req.body["parameter"];
                newEx.Constant = req.body["constant"];
                newEx.Level = <number>req.body["level"];
                newEx.CreatedBy = req.user.UserId;
                newEx.UpdatedBy = req.user.UserId;
                newEx.NoParameter = false;
                newEx.IsPublished = true;
                if (newEx.Parameter.length === 2)
                    newEx.NoParameter = true;
                var result = await exerciseService.update(exerciseId,newEx)
                res.json({ status: 200 })
            } catch (e) {
                res.json({ status: 201 })
            }
        });

        router.post("/luu-bai-moi", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            try {
                var newEx: any = {}
                newEx.ChapterId = <number>req.body["chapterId"];
                newEx.Content = req.body["content"];
                newEx.Parameter = req.body["parameter"];
                newEx.Constant = req.body["constant"];
                newEx.Level = <number>req.body["level"];
                newEx.CreatedBy = req.user.UserId;
                newEx.UpdatedBy = req.user.UserId;
                newEx.NoParameter = false;
                newEx.IsPublished = true;
                if (newEx.Parameter.length === 2)
                    newEx.NoParameter = true;
                var result = await exerciseService.add(newEx)
                res.json({status : 200})
            }
            catch(e){
                res.json({status : 201})
            }
        });
    }
}
