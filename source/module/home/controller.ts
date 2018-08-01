import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import SubjectService from '../../service/database/SubjectService';
import ChapterService from '../../service/database/ChapterService';
import ExerciseService from '../../service/database/ExerciseService';

export default class FunctionController {
    public static route(router: Router) {

        let gradeService: GradeService = new GradeService();
        

        router.get("/", async function (req: Request, res: Response) {
            res.render("../module/home/view", {
                gradeList: await gradeService.findAll()
            });
        });

        
    }
}