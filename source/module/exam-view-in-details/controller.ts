import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import ExamService from '../../service/database/ExamService'
import { Exam } from '../../model/Exam';


export default class ExamViewInDetailsController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        let examService = new ExamService();

        router.get("/lam-bai-thi/buoc-1", async function (req: Request, res: Response) {
            var examId = req.query["mabaithi"];
            var exam = await examService.getById(examId);

            res.render("../module/exam-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                exam: exam,
                step: 1
            });
        });

        router.get("/lam-bai-thi/buoc-2", async function (req: Request, res: Response) {
            var examId = req.query["mabaithi"];
            var exam: Exam = <Exam> await examService.getById(examId);
            var QuestionList: Array<Object> = JSON.parse(exam.QuestionList);
            var ProcessedQuestionList = await examService.getExamForTest(examId);

            res.render("../module/exam-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                ProcessedQuestionList: ProcessedQuestionList,
                exam: exam,
                fixed: "yes",
                step: 2
            });
        });

        router.post("/nop-bai", async function (req: Request, res: Response) {
            var examId = req.body["madethi"];
            var QuestionList = JSON.parse(req.body["dethi"])
            var exam: Exam = <Exam> await examService.getById(examId);
            var Structure = JSON.parse(exam.Structure);
            //var QuestionList = JSON.parse(exam.QuestionList)
            var ChoiceList = []
            for (let index = 0; index < Number(Structure["QuestionNumberInput"]); index++) {
                const choice = req.body["lc_" + index];
                if (choice != null) {
                    let SolutionList = QuestionList.find(x => x.QuestionId == index).SolutionList
                    let correct = SolutionList.find(x => x.id == choice).solution
                    ChoiceList.push({
                        QuestionId: index,
                        Choice: choice,
                        Correct: correct
                    })
                }
            }
            res.render("../module/exam-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                ChoiceList: ChoiceList,
                step: 3,
                ProcessedQuestionList: QuestionList,

            });
        });

        
    }
}
