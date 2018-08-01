"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GradeService_1 = require("../../service/database/GradeService");
const ExamService_1 = require("../../service/database/ExamService");
class ExamViewInDetailsController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let examService = new ExamService_1.default();
        router.get("/lam-bai-thi/buoc-1", async function (req, res) {
            var examId = req.query["mabaithi"];
            var exam = await examService.getById(examId);
            res.render("../module/exam-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                exam: exam,
                step: 1
            });
        });
        router.get("/lam-bai-thi/buoc-2", async function (req, res) {
            var examId = req.query["mabaithi"];
            var exam = await examService.getById(examId);
            var QuestionList = JSON.parse(exam.QuestionList);
            var ProcessedQuestionList = await examService.getExamForTest(examId);
            res.render("../module/exam-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                ProcessedQuestionList: ProcessedQuestionList,
                exam: exam,
                fixed: "yes",
                step: 2
            });
        });
        router.post("/nop-bai", async function (req, res) {
            var examId = req.body["madethi"];
            var QuestionList = JSON.parse(req.body["dethi"]);
            var exam = await examService.getById(examId);
            var Structure = JSON.parse(exam.Structure);
            //var QuestionList = JSON.parse(exam.QuestionList)
            var ChoiceList = [];
            for (let index = 0; index < Number(Structure["QuestionNumberInput"]); index++) {
                const choice = req.body["lc_" + index];
                if (choice != null) {
                    let SolutionList = QuestionList.find(x => x.QuestionId == index).SolutionList;
                    let correct = SolutionList.find(x => x.id == choice).solution;
                    ChoiceList.push({
                        QuestionId: index,
                        Choice: choice,
                        Correct: correct
                    });
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
exports.default = ExamViewInDetailsController;
