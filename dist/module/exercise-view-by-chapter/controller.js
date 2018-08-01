"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GradeService_1 = require("../../service/database/GradeService");
const SubjectService_1 = require("../../service/database/SubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
class ExerciseViewByChapterController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let authentication = new authentication_1.Authentication();
        router.get("/xem-bai-tap-theo-chuong/:chapterid/:chaptername/trang-:page", async function (req, res) {
            const chapterId = req.params["chapterid"];
            const page = req.params["page"];
            const chapter = await chapterService.getById(chapterId);
            res.render("../module/exercise-view-by-chapter/view", {
                gradeList: await gradeService.findAll(),
                chapter: chapter,
                ExerciseList: chapter.ExerciseList,
                page: page
            });
        });
        router.get("/xem-bai-tap-theo-chuong/:chapterid/:chaptername/trang-:page", async function (req, res) {
            const chapterId = req.params["chapterid"];
            const page = req.params["page"];
            const chapter = await chapterService.getById(chapterId);
            res.render("../module/exercise-view-by-chapter/view", {
                gradeList: await gradeService.findAll(),
                chapter: chapter,
                ExerciseList: chapter.ExerciseList,
                page: page,
                sort: false
            });
        });
        router.get("/tim-kiem-de-bai-theo-chuong/:chapterid/:chaptername/:content/trang-:page", async function (req, res) {
            const chapterId = req.params["chapterid"];
            const page = req.params["page"];
            const content = req.params["content"];
            const chapter = await chapterService.getById(chapterId);
            const ExerciseList = await exerciseService.searchExercise(content, chapterId);
            res.render("../module/exercise-view-by-chapter/view", {
                gradeList: await gradeService.findAll(),
                chapter: chapter,
                ExerciseList: ExerciseList,
                page: page,
                sort: true
            });
        });
    }
}
exports.default = ExerciseViewByChapterController;
