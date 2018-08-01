"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GradeSubjectService_1 = require("../../service/database/GradeSubjectService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
const SolutionService_1 = require("../../service/database/SolutionService");
class AdminExerciseSolutionController {
    static route(router) {
        let authentication = new authentication_1.Authentication;
        let gradeSubjectService = new GradeSubjectService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let solutionService = new SolutionService_1.default();
        router.get("/them-bai-giai", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const exerciseId = req.query["mabaitap"];
            res.render("../module/admin-exercise-solution/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                exerciseInfo: await exerciseService.getById(exerciseId)
            });
        });
        router.get("/sua-bai-giai", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const solutionId = req.query["mabaigiai"];
            const solution = await solutionService.getById(solutionId);
            const exerciseInfo = await exerciseService.getById(solution.Exercise.ExerciseId);
            res.render("../module/admin-exercise-solution/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                solution: solution,
                exerciseInfo: exerciseInfo
            });
        });
        router.get("/luu-bai-giai", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var solution = {};
            solution.ExerciseId = req.query["mabaitap"];
            solution.Content = req.query["noidung"];
            solution.Formula = req.query["congthuc"];
            if (!solution.Formula)
                solution.Formula = "[]";
            solution.CreatedBy = req.user.UserId;
            solution.UpdatedBy = req.user.UserId;
            solution.IsPublished = true;
            var newSolution = await solutionService.add(solution);
            res.redirect("/them-bai-giai?mabaitap=" + solution.ExerciseId);
        });
        router.get("/luu-sua-bai-giai", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var solution = {};
            var SolutionId = req.query["mabaigiai"];
            solution.ExerciseId = req.query["mabaitap"];
            solution.Content = req.query["noidung"];
            solution.Formula = req.query["congthuc"];
            if (!solution.Formula)
                solution.Formula = "[]";
            solution.UpdatedBy = req.user.UserId;
            solution.IsPublished = true;
            var updateSolution = await solutionService.update(SolutionId, solution);
            res.redirect("/quan-ly-bai-giai?mabaitap=" + solution.ExerciseId);
        });
    }
}
exports.default = AdminExerciseSolutionController;
