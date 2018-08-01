"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const SubjectService_1 = require("../../service/database/SubjectService");
const GradeService_1 = require("../../service/database/GradeService");
const GradeSubjectService_1 = require("../../service/database/GradeSubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
const UnitService_1 = require("../../service/database/UnitService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
class AdminExerciseController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let gradeSubjectService = new GradeSubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let authentication = new authentication_1.Authentication();
        let unitService = new UnitService_1.default();
        let exerciseService = new ExerciseService_1.default();
        router.get("/thong-tin-bai-tap", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/admin-exercise/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll()
            });
        });
        router.get("/admin/tim-kiem-bai-tap", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const content = req.query["content"];
            const chapterId = req.query["chapterid"];
            req.flash("redirectUrl", req.url);
            let searchResult = await exerciseService.searchExercise(content, chapterId);
            res.render("../module/admin-exercise/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll(),
                searchResult: searchResult,
                search: true
            });
        });
        router.get("/ngung-phat-hanh", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const exerciseId = req.query["mabaitap"];
            const exercise = await exerciseService.togglePublised(exerciseId);
            res.redirect(req.flash("redirectUrl"));
        });
    }
}
exports.default = AdminExerciseController;
