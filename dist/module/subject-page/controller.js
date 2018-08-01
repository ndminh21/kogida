"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GradeService_1 = require("../../service/database/GradeService");
const SubjectService_1 = require("../../service/database/SubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
class SubjectPageController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let authentication = new authentication_1.Authentication();
        router.get("/trang-mon-hoc", async function (req, res) {
            const gradeId = req.query["khoi"];
            const subjectId = req.query["mon"];
            const chapterList = await chapterService.getByGradeIdAndSubjectId(gradeId, subjectId);
            res.render("../module/subject-page/view", {
                gradeList: await gradeService.findAll(),
                gradeInfo: await gradeService.findById(gradeId),
                subjectInfo: await subjectService.findById(subjectId),
                chapterList: chapterList
            });
        });
    }
}
exports.default = SubjectPageController;
