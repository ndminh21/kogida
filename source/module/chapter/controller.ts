import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import SubjectService from '../../service/database/SubjectService'
import GradeService from '../../service/database/GradeService'
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ChapterService from '../../service/database/ChapterService';

export default class GradeSubjectController {
    public static route(router: Router): void {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let gradeSubjectService: GradeSubjectService = new GradeSubjectService();
        let chapterService: ChapterService = new ChapterService();
        var authentication = new Authentication()
        router.get("/thong-tin-ve-chuong", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            res.render("../module/chapter/view", {
                userInfo: req.user,
                gradeList: await gradeService.findAll(),
                subjectList: await subjectService.findAll(),
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll()
            });
        });

        router.post("/tao-chuong-moi", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            var newChapter : any  = {}
            newChapter.GSId = req.body["gradeSubjectId"];
            newChapter.ChapterName = req.body["chaptername"];
            newChapter.ChapterOrder = req.body["chapterorder"];
            newChapter.Content = req.body["content"]
            newChapter.CreatedUser = req.user.UserId
            newChapter.UpdatedUser = req.user.UserId
            //console.log(newChapter)
            if (newChapter.gradeSubjectId != "-1")
                await chapterService.addChapter(newChapter)
            //console.log(req.body)
            res.redirect("/thong-tin-ve-chuong");
        });

        router.get("/sua-chuong", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            let chapterId: number = req.query["ma"];

            res.render("../module/chapter/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll(),
                repair: true,
                chapterInfo: await chapterService.getById(chapterId)
            });
        });

        router.get("/sua-ten-chuong", authentication.isAuthenticated, authentication.canAccess, 
            async function (req: Request, res: Response) {
                let chapterId: number = req.query["ma"];
                let chapterName: string = req.query["ten"];
                await chapterService.updateName(chapterId, chapterName);
                res.redirect("/thong-tin-ve-chuong");
            });

        router.get("/sua-ttht-chuong", authentication.isAuthenticated, authentication.canAccess, 
            async function (req: Request, res: Response) {
                let chapterId: number = req.query["ma"];
                let chapterOrder: number = Number(req.query["ttht"]);
                await chapterService.updateOrder(chapterId, chapterOrder);
                res.redirect("/thong-tin-ve-chuong");
            });    

        router.get("/xoa-chuong", authentication.isAuthenticated, authentication.canAccess, 
            async function (req: Request, res: Response) {
                let chapterId: number = req.query["ma"];
                var result :any = await chapterService.deleteChapter(chapterId);
                if (result.error_message)
                    req.flash("error_message", result.error_message)
                res.redirect("/thong-tin-ve-chuong");
            });
            
        router.post("/sua-chuong", authentication.isAuthenticated, authentication.canAccess,
            async function (req: Request, res: Response) {
                let chapterId: number = req.body["chapterid"];
                var chapter: any = {}
                chapter.GSId = req.body["gradeSubjectId"];
                chapter.ChapterName = req.body["chaptername"];
                chapter.ChapterOrder = req.body["chapterorder"];
                chapter.Content = req.body["content"]
                chapter.UpdatedUser = req.user.UserId
                var newChapter = await chapterService.update(chapterId,chapter)
                res.redirect('/thong-tin-ve-chuong')
            });
    }
}
