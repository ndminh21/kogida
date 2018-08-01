"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const SubjectService_1 = require("../../service/database/SubjectService");
const GradeService_1 = require("../../service/database/GradeService");
const GradeSubjectService_1 = require("../../service/database/GradeSubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
class GradeSubjectController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let gradeSubjectService = new GradeSubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let authentication = new authentication_1.Authentication();
        router.get("/phan-mon-cho-khoi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/grade-subject/view", {
                userInfo: req.user,
                gradeList: await gradeService.findAll(),
                subjectList: await subjectService.findAll(),
                gradeSubjectList: await gradeSubjectService.findAll()
            });
        });
        router.post("/phan-mon-thu-cong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const gradeId = req.body["gradeid"];
            const subjectId = req.body["subjectid"];
            var gs = await gradeSubjectService.checkExist(gradeId, subjectId);
            if (!gs)
                await gradeSubjectService.add(gradeId, subjectId);
            res.redirect("/phan-mon-cho-khoi");
        });
        router.post("/phan-mon-thu-cong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const gradeId = req.body["gradeid"];
            const subjectId = req.body["subjectid"];
            var gs = await gradeSubjectService.checkExist(gradeId, subjectId);
            if (!gs)
                await gradeSubjectService.add(gradeId, subjectId);
            res.redirect("/phan-mon-cho-khoi");
        });
        router.get("/xoa-phan-cong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const gradeId = req.query["makhoi"];
            const subjectId = req.query["mamon"];
            var result = await gradeSubjectService.deleteGS(gradeId, subjectId);
            if (result.error_message)
                req.flash("error_message", result.error_message);
            res.redirect("/phan-mon-cho-khoi");
        });
        router.post("/lay-chuong-theo-mon-khoi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const gradeSubjectId = req.body.gradeSubjectId;
            var results = await chapterService.getByGradeSubjectId(gradeSubjectId);
            res.json(results);
        });
    }
}
exports.default = GradeSubjectController;
