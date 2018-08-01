"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const SubjectService_1 = require("../../service/database/SubjectService");
class SubjectController {
    static route(router) {
        let subjectService = new SubjectService_1.default();
        let authentication = new authentication_1.Authentication();
        router.get("/quan-ly-mon-hoc", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/subject/view", {
                userInfo: req.user,
                subjectList: await subjectService.findAll()
            });
        });
        router.get("/tao-mon-hoc-moi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var subjectName = req.query["ten"];
            await subjectService.addSubject(subjectName);
            res.redirect("/quan-ly-mon-hoc");
        });
        router.get("/sua-ten-mon-hoc", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let subjectId = req.query["ma"];
            let subjectName = req.query["ten"];
            await subjectService.updateName(subjectId, subjectName);
            res.redirect("/quan-ly-mon-hoc");
        });
        router.get("/xoa-mon-hoc", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let subjectId = req.query["ma"];
            var result = await subjectService.deleteSubject(subjectId);
            if (result.error_message)
                req.flash("error_message", result.error_message);
            res.redirect("/quan-ly-mon-hoc");
        });
    }
}
exports.default = SubjectController;
