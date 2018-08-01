import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import SubjectService from '../../service/database/SubjectService'
import GradeService from '../../service/database/GradeService'
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ChapterService from '../../service/database/ChapterService';
import UnitService from '../../service/database/UnitService'
import { Exercise } from '../../model/Exercise';
import ExerciseService from '../../service/database/ExerciseService'
export default class AdminExerciseController {
    public static route(router: Router): void {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let gradeSubjectService: GradeSubjectService = new GradeSubjectService();
        let chapterService: ChapterService = new ChapterService();
        let authentication = new Authentication();
        let unitService = new UnitService();
        let exerciseService = new ExerciseService();
        router.get("/thong-tin-bai-tap", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            res.render("../module/admin-exercise/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll()
            })
        });

        router.get("/admin/tim-kiem-bai-tap", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            const content = req.query["content"];
            const chapterId = req.query["chapterid"];
            req.flash("redirectUrl",req.url)
            let searchResult: Array<Exercise> = await exerciseService.searchExercise(content,chapterId);
            res.render("../module/admin-exercise/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll(),
                searchResult: searchResult,
                search: true
            });
        });

        router.get("/ngung-phat-hanh", authentication.isAuthenticated, authentication.canAccess,
            async function (req: Request, res: Response) {
                const exerciseId = req.query["mabaitap"];
                const exercise  = await exerciseService.togglePublised(exerciseId);
                res.redirect(req.flash("redirectUrl"))
            });
    }
}
