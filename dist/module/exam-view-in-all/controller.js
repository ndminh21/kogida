"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GradeService_1 = require("../../service/database/GradeService");
const ExamService_1 = require("../../service/database/ExamService");
class ExamViewInAllController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let examService = new ExamService_1.default();
        router.get("/thi-thu-kogida", async function (req, res) {
            res.render("../module/exam-view-in-all/view", {
                gradeList: await gradeService.findAll(),
                examList: await examService.findAll()
            });
        });
        router.post("/tim-kiem-ky-thi-bi-mat", async function (req, res) {
            var secret = req.body["secret"];
            var exam = await examService.getExamBySecrett(secret);
            if (exam) {
                req.session.examId = exam.toJSON().ExamId;
            }
            else {
            }
            res.render("../module/exam-view-in-all/view", {
                gradeList: await gradeService.findAll(),
                examList: await examService.findAll()
            });
        });
    }
}
exports.default = ExamViewInAllController;
