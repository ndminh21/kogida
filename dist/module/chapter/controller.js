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
        var authentication = new authentication_1.Authentication();
        router.get("/thong-tin-ve-chuong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/chapter/view", {
                userInfo: req.user,
                gradeList: await gradeService.findAll(),
                subjectList: await subjectService.findAll(),
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll()
            });
        });
        router.post("/tao-chuong-moi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var newChapter = {};
            newChapter.GSId = req.body["gradeSubjectId"];
            newChapter.ChapterName = req.body["chaptername"];
            newChapter.ChapterOrder = req.body["chapterorder"];
            newChapter.Content = req.body["content"];
            newChapter.CreatedUser = req.user.UserId;
            newChapter.UpdatedUser = req.user.UserId;
            //console.log(newChapter)
            if (newChapter.gradeSubjectId != "-1")
                await chapterService.addChapter(newChapter);
            //console.log(req.body)
            res.redirect("/thong-tin-ve-chuong");
        });
        router.get("/sua-chuong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let chapterId = req.query["ma"];
            res.render("../module/chapter/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll(),
                repair: true,
                chapterInfo: await chapterService.getById(chapterId)
            });
        });
        router.get("/sua-ten-chuong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let chapterId = req.query["ma"];
            let chapterName = req.query["ten"];
            await chapterService.updateName(chapterId, chapterName);
            res.redirect("/thong-tin-ve-chuong");
        });
        router.get("/sua-ttht-chuong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let chapterId = req.query["ma"];
            let chapterOrder = Number(req.query["ttht"]);
            await chapterService.updateOrder(chapterId, chapterOrder);
            res.redirect("/thong-tin-ve-chuong");
        });
        router.get("/xoa-chuong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let chapterId = req.query["ma"];
            var result = await chapterService.deleteChapter(chapterId);
            if (result.error_message)
                req.flash("error_message", result.error_message);
            res.redirect("/thong-tin-ve-chuong");
        });
        router.post("/sua-chuong", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let chapterId = req.body["chapterid"];
            var chapter = {};
            chapter.GSId = req.body["gradeSubjectId"];
            chapter.ChapterName = req.body["chaptername"];
            chapter.ChapterOrder = req.body["chapterorder"];
            chapter.Content = req.body["content"];
            chapter.UpdatedUser = req.user.UserId;
            var newChapter = await chapterService.update(chapterId, chapter);
            res.redirect('/thong-tin-ve-chuong');
        });
    }
}
exports.default = GradeSubjectController;
