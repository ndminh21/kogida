"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const SubjectService_1 = require("../../service/database/SubjectService");
const GradeService_1 = require("../../service/database/GradeService");
const GradeSubjectService_1 = require("../../service/database/GradeSubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
const UnitService_1 = require("../../service/database/UnitService");
class UnitController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let gradeSubjectService = new GradeSubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        var authentication = new authentication_1.Authentication();
        let unitService = new UnitService_1.default();
        router.get("/thong-tin-ve-bai-hoc", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/unit/view", {
                userInfo: req.user,
                gradeList: await gradeService.findAll(),
                subjectList: await subjectService.findAll(),
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll(),
                unitList: await unitService.findAll()
            });
        });
        router.post("/tao-bai-hoc-moi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var newUnit = {};
            newUnit.ChapterId = req.body["chapterId"];
            newUnit.UnitName = req.body["unitname"];
            newUnit.UnitOrder = req.body["unitorder"];
            newUnit.Content = req.body["content"];
            newUnit.CreatedBy = req.user.UserId;
            newUnit.UpdatedBy = req.user.UserId;
            await unitService.add(newUnit);
            res.redirect('/thong-tin-ve-bai-hoc');
        });
        router.get("/sua-bai-hoc", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let unitId = req.query["ma"];
            if (unitId == null)
                res.redirect("/thong-tin-ve-bai-hoc");
            res.render("../module/unit/view", {
                userInfo: req.user,
                gradeList: await gradeService.findAll(),
                subjectList: await subjectService.findAll(),
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll(),
                unitList: await unitService.findAll(),
                repair: true,
                unitInfo: await unitService.getById(unitId)
            });
        });
        router.post("/sua-bai-hoc", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var unitId = req.body["unitid"];
            var unit = {};
            unit.UnitName = req.body["unitname"];
            unit.UnitOrder = req.body["unitorder"];
            unit.Content = req.body["content"];
            unit.UpdatedBy = req.user.UserId;
            await unitService.update(unitId, unit);
            res.redirect('/thong-tin-ve-bai-hoc');
        });
    }
}
exports.default = UnitController;
