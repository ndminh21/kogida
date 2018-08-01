"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GradeService_1 = require("../../service/database/GradeService");
class GradeController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let authentication = new authentication_1.Authentication();
        router.get("/quan-ly-khoi-lop", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/grade/view", {
                userInfo: req.user,
                message: "",
                gradeList: await gradeService.findAll()
            });
        });
        router.get("/tao-khoi-lop-moi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var gradeName = req.query["ten"];
            await gradeService.addGrade(gradeName);
            res.redirect("/quan-ly-khoi-lop");
        });
        router.get("/sua-ten-khoi-lop", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let gradeId = req.query["ma"];
            let gradeName = req.query["ten"];
            await gradeService.updateName(gradeId, gradeName);
            res.redirect("/quan-ly-khoi-lop");
        });
        router.get("/xoa-khoi-lop", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let gradeId = req.query["ma"];
            var result = await gradeService.deleteGrade(gradeId);
            if (result.error_message)
                req.flash("error_message", result.error_message);
            res.redirect("/quan-ly-khoi-lop");
        });
    }
}
exports.default = GradeController;
