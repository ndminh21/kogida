"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const SubjectService_1 = require("../../service/database/SubjectService");
const GradeService_1 = require("../../service/database/GradeService");
const GradeSubjectService_1 = require("../../service/database/GradeSubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
const UnitService_1 = require("../../service/database/UnitService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
class AdminSolutionController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let gradeSubjectService = new GradeSubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let authentication = new authentication_1.Authentication();
        let unitService = new UnitService_1.default();
        let exerciseService = new ExerciseService_1.default();
        router.get("/quan-ly-bai-giai", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var exerciseId = req.query["mabaitap"];
            res.render("../module/admin-solution/view", {
                userInfo: req.user,
                exercise: await exerciseService.getById(exerciseId)
            });
        });
    }
}
exports.default = AdminSolutionController;
