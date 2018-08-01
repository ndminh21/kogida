import { GradeSubject } from './../../model/GradeSubject';
import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import SubjectService from '../../service/database/SubjectService'
import GradeService from '../../service/database/GradeService'
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ChapterService from '../../service/database/ChapterService';
import UnitService from '../../service/database/UnitService'
import { Exercise } from '../../model/Exercise';
import ExerciseService from '../../service/database/ExerciseService'
import ExamService from '../../service/database/ExamService'
import * as moment from "moment"
import { Exam } from '../../model/Exam';

export default class AdminMyExamController {

    public static route(router: Router): void {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let gradeSubjectService: GradeSubjectService = new GradeSubjectService();
        let chapterService: ChapterService = new ChapterService();
        let authentication = new Authentication();
        let unitService = new UnitService();
        let exerciseService = new ExerciseService();
        let examService = new ExamService();

        router.get("/admin/de-thi-thu-cua-toi", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            res.render("../module/admin-my-exam/view", {
                userInfo: req.user,
                examList: await examService.getExamByCreatedUser(req.user.UserId)
            })
        });

        router.get("/admin/dieu-chinh-phat-hanh-thi-thu", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            var examId = req.query["makythi"];
            var exam = await examService.togglePublished(examId);
            res.redirect("/admin/de-thi-thu-cua-toi");
        });
        
    }
}
