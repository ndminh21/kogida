import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import SubjectService from '../../service/database/SubjectService'
import GradeService from '../../service/database/GradeService'
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ChapterService from '../../service/database/ChapterService';
import UnitService from '../../service/database/UnitService'
import { Exercise } from '../../model/Exercise';
import ExerciseService from '../../service/database/ExerciseService'
export default class AdminSolutionController {
    public static route(router: Router): void {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let gradeSubjectService: GradeSubjectService = new GradeSubjectService();
        let chapterService: ChapterService = new ChapterService();
        let authentication = new Authentication();
        let unitService = new UnitService();
        let exerciseService = new ExerciseService();

        router.get("/quan-ly-bai-giai", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            var exerciseId = req.query["mabaitap"];

            res.render("../module/admin-solution/view", {
                userInfo: req.user,
                exercise: await exerciseService.getById(exerciseId)
            })
        });

        
    }
}
