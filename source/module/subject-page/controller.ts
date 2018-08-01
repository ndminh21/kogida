import { Authentication } from './../authentication/authentication';
import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import SubjectService from '../../service/database/SubjectService';
import ChapterService from '../../service/database/ChapterService';
import ExerciseService from '../../service/database/ExerciseService';
import { Chapter } from '../../model/Chapter';

export default class SubjectPageController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let chapterService: ChapterService = new ChapterService();
        let exerciseService: ExerciseService = new ExerciseService();
        let authentication = new  Authentication();

        router.get("/trang-mon-hoc", async function (req: Request, res: Response) {
            const gradeId = req.query["khoi"];
            const subjectId = req.query["mon"];

            const chapterList: Array<Chapter> = <Array<Chapter>> await chapterService.getByGradeIdAndSubjectId(gradeId, subjectId);

            res.render("../module/subject-page/view", {
                gradeList: await gradeService.findAll(),
                gradeInfo: await gradeService.findById(gradeId),
                subjectInfo: await subjectService.findById(subjectId),
                chapterList: chapterList
            });
        });

    }
}
