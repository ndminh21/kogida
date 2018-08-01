import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import ExamService from '../../service/database/ExamService'


export default class ExamViewInAllController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        let examService = new ExamService();

        router.get("/thi-thu-kogida", async function (req: Request, res: Response) {
            res.render("../module/exam-view-in-all/view", {
                gradeList: await gradeService.findAll(),
                examList: await examService.findAll()
            });
        });

        router.post("/tim-kiem-ky-thi-bi-mat", async function (req: Request, res: Response) {
            var secret = req.body["secret"];
            var exam = await examService.getExamBySecrett(secret)
            if(exam){
                req.session.examId = exam.toJSON().ExamId
            }else{

            }
            

            res.render("../module/exam-view-in-all/view", {
                gradeList: await gradeService.findAll(),
                examList: await examService.findAll()
            });
        });
    }
}
