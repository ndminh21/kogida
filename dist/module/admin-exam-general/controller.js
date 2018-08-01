"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const SubjectService_1 = require("../../service/database/SubjectService");
const GradeService_1 = require("../../service/database/GradeService");
const GradeSubjectService_1 = require("../../service/database/GradeSubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
const UnitService_1 = require("../../service/database/UnitService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
const ExamService_1 = require("../../service/database/ExamService");
const moment = require("moment");
class AdminExamGeneralController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let gradeSubjectService = new GradeSubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let authentication = new authentication_1.Authentication();
        let unitService = new UnitService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let examService = new ExamService_1.default();
        router.get("/admin/tao-thi-thu/buoc-1", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var exerciseId = req.query["mabaitap"];
            res.render("../module/admin-exam-general/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                step: 1
            });
        });
        router.get("/admin/tao-thi-thu/buoc-2", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var examId = req.query["makythi"];
            res.render("../module/admin-exam-general/view", {
                userInfo: req.user,
                exam: await examService.getById(examId),
                step: 2
            });
        });
        router.get("/admin/luu-thi-thu/buoc-1", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var ExamName = req.query["ExamName"]; //save
            var Time = req.query["Time"]; //save
            var GradeSubjectId = req.query["GradeSubjectId"] == "-1" ? null : req.query["GradeSubjectId"]; //save
            var QuestionNumber = req.query["QuestionNumber"]; //save
            var Deadline = req.query["Deadline"]; // save
            var Secret = req.query["Secret"];
            var UseDeadline = req.query["UseDeadline"];
            var UseSecret = req.query["UseSecret"];
            if (UseDeadline === "yes") {
                Deadline = moment(Deadline, "DD/MM/YYYY HH:mm");
            }
            else
                Deadline = null;
            if (UseSecret === "yes") {
                var examSecret = await examService.getExamBySecrett(Secret);
                if (examSecret) {
                    res.render("../module/admin-exam-general/view", {
                        userInfo: req.user,
                        gradeSubjectList: await gradeSubjectService.findAll(),
                        step: 1,
                        message: "failed_secret"
                    });
                    return false;
                }
            }
            else
                Deadline = null;
            var QuestionNumberInput = req.query["QuestionNumberInput"];
            var QuestionLabel = req.query["QuestionLabel"];
            var QuestionNumberWithLabel = req.query["QuestionNumberWithLabel"];
            var Structure = null; //save
            if (Array.isArray(QuestionLabel)) {
                var QuestionWithLabelAndNumberList = QuestionLabel.map((label, index) => new Object({ label: label, number: Number(QuestionNumberWithLabel[index]) }));
                Structure = JSON.stringify({
                    QuestionNumber: QuestionNumber,
                    QuestionNumberInput: QuestionNumberInput,
                    QuestionWithLabelAndNumberList: QuestionWithLabelAndNumberList
                });
            }
            else {
                if (QuestionLabel != null)
                    Structure = JSON.stringify({
                        QuestionNumber: QuestionNumber,
                        QuestionNumberInput: QuestionNumberInput,
                        QuestionWithLabelAndNumberList: [{ label: QuestionLabel, number: Number(QuestionNumberWithLabel) }]
                    });
                else
                    Structure = JSON.stringify({
                        QuestionNumber: QuestionNumber,
                        QuestionNumberInput: QuestionNumberInput,
                        QuestionWithLabelAndNumberList: []
                    });
            }
            var exam = {};
            exam.ExamName = ExamName;
            exam.Time = Time;
            exam.GradeSubjectId = GradeSubjectId;
            exam.Deadline = Deadline;
            exam.Secret = Secret;
            exam.Structure = Structure;
            exam.CreatedBy = req.user.UserId;
            exam.UpdatedBy = req.user.UserId;
            exam.IsPublished = false;
            var newExam = await examService.add(exam);
            res.redirect("/admin/tao-thi-thu/buoc-2?makythi=" + newExam.toJSON().ExamId);
        });
        router.post("/admin/luu-thi-thu/buoc-2", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var ExamId = req.body["ExamId"];
            var Exam = await examService.getById(ExamId);
            var QuestionList = []; //save
            for (let i = 0; i < JSON.parse(Exam.Structure)["QuestionNumberInput"]; i++) {
                var content = req.body["content_" + i];
                var isSolution = req.body["issolution_" + i];
                var solutionList = req.body["solutiontext_" + i];
                var imageList = req.body["imglink_" + i];
                QuestionList.push({
                    QuestionId: i,
                    Content: content,
                    Label: req.body["label_" + i],
                    AllowRandom: req.body["allowrandom_" + i] != null,
                    SolutionList: solutionList.map((value, index) => new Object({ text: value, solution: isSolution == index, id: index })),
                    MaxSolutionInRow: req.body["maxsolutioninrow_" + i],
                    ImageList: imageList.filter((link) => link.trim() != ""),
                    MaxImageInRow: req.body["maximginrow_" + i]
                });
            }
            var updateExam = await examService.update(ExamId, { QuestionList: JSON.stringify(QuestionList) });
            res.redirect("/admin/de-thi-thu-cua-toi");
        });
    }
}
exports.default = AdminExamGeneralController;
