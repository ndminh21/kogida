"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GradeService_1 = require("../../service/database/GradeService");
const SubjectService_1 = require("../../service/database/SubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
const UnitService_1 = require("../../service/database/UnitService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
class UnitViewController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let unitService = new UnitService_1.default();
        let subjectService = new SubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let authentication = new authentication_1.Authentication();
        router.get("/trang-bai-hoc", async function (req, res) {
            const mabaihoc = req.query["ma"];
            const unit = await unitService.getById(mabaihoc);
            const chapter = await chapterService.getById(unit.Chapter.ChapterId);
            res.render("../module/unit-view/view", {
                gradeList: await gradeService.findAll(),
                unit: unit,
                chapter: chapter
            });
        });
    }
}
exports.default = UnitViewController;
