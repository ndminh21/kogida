import { Authentication } from './../authentication/authentication';
import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import SubjectService from '../../service/database/SubjectService';
import ChapterService from '../../service/database/ChapterService';
import UnitService from '../../service/database/UnitService';
import ExerciseService from '../../service/database/ExerciseService';
import { Chapter } from '../../model/Chapter';
import { Unit } from '../../model/Unit';
import SolutionService from '../../service/math/SolutionService'
import Parse from '../../service/math/Parse';
import GrammarService from '../../service/grammar/GrammarService';
export default class UnitViewController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        let unitService: UnitService = new UnitService();
        let subjectService: SubjectService = new SubjectService();
        let chapterService: ChapterService = new ChapterService();
        let exerciseService: ExerciseService = new ExerciseService();
        let authentication = new  Authentication();

        router.get("/trang-bai-hoc", async function (req: Request, res: Response) {
            const mabaihoc = req.query["ma"];
            const unit: Unit = <Unit> await unitService.getById(mabaihoc);
            const chapter: Chapter = <Chapter> await chapterService.getById(unit.Chapter.ChapterId);
            res.render("../module/unit-view/view", {
                gradeList: await gradeService.findAll(),
                unit: unit,
                chapter: chapter
            });
        });
    }
}
