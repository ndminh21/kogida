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
class AdminMyExamController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let gradeSubjectService = new GradeSubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let authentication = new authentication_1.Authentication();
        let unitService = new UnitService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let examService = new ExamService_1.default();
        router.get("/admin/de-thi-thu-cua-toi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/admin-my-exam/view", {
                userInfo: req.user,
                examList: await examService.getExamByCreatedUser(req.user.UserId)
            });
        });
        router.get("/admin/dieu-chinh-phat-hanh-thi-thu", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var examId = req.query["makythi"];
            var exam = await examService.togglePublished(examId);
            res.redirect("/admin/de-thi-thu-cua-toi");
        });
    }
}
exports.default = AdminMyExamController;
