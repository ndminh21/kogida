"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GradeSubjectService_1 = require("../../service/database/GradeSubjectService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
const ChapterService_1 = require("../../service/database/ChapterService");
class ExerciseInputController {
    static route(router) {
        let authentication = new authentication_1.Authentication;
        let gradeSubjectService = new GradeSubjectService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let chapterService = new ChapterService_1.default();
        router.get("/them-bai-tap-moi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/admin-exercise-input/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll()
            });
        });
        router.get("/sua-de-bai", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var exerciseId = req.query["mabaitap"];
            var exercise = await exerciseService.getById(exerciseId);
            res.render("../module/admin-exercise-input/view", {
                userInfo: req.user,
                exercise: exercise,
                chapterList: await chapterService.getByGradeSubjectId(exercise.Chapter.gradeSubject.Id),
                gradeSubjectList: await gradeSubjectService.findAll()
            });
        });
        router.post("/luu-sua-de", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            try {
                var newEx = {};
                var exerciseId = req.body["exerciseId"];
                newEx.ChapterId = req.body["chapterId"];
                newEx.Content = req.body["content"];
                newEx.Parameter = req.body["parameter"];
                newEx.Constant = req.body["constant"];
                newEx.Level = req.body["level"];
                newEx.CreatedBy = req.user.UserId;
                newEx.UpdatedBy = req.user.UserId;
                newEx.NoParameter = false;
                newEx.IsPublished = true;
                if (newEx.Parameter.length === 2)
                    newEx.NoParameter = true;
                var result = await exerciseService.update(exerciseId, newEx);
                res.json({ status: 200 });
            }
            catch (e) {
                res.json({ status: 201 });
            }
        });
        router.post("/luu-bai-moi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            try {
                var newEx = {};
                newEx.ChapterId = req.body["chapterId"];
                newEx.Content = req.body["content"];
                newEx.Parameter = req.body["parameter"];
                newEx.Constant = req.body["constant"];
                newEx.Level = req.body["level"];
                newEx.CreatedBy = req.user.UserId;
                newEx.UpdatedBy = req.user.UserId;
                newEx.NoParameter = false;
                newEx.IsPublished = true;
                if (newEx.Parameter.length === 2)
                    newEx.NoParameter = true;
                var result = await exerciseService.add(newEx);
                res.json({ status: 200 });
            }
            catch (e) {
                res.json({ status: 201 });
            }
        });
    }
}
exports.default = ExerciseInputController;
