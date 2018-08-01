import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import SubjectService from '../../service/database/SubjectService'
import GradeService from '../../service/database/GradeService'
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ChapterService from "../../service/database/ChapterService";

export default class GradeSubjectController {
    public static route(router: Router): void {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let gradeSubjectService: GradeSubjectService = new GradeSubjectService();
        let chapterService : ChapterService = new ChapterService();
        let authentication = new Authentication()
        router.get("/phan-mon-cho-khoi", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            res.render("../module/grade-subject/view", {
                userInfo: req.user,
                gradeList: await gradeService.findAll(),
                subjectList: await subjectService.findAll(),
                gradeSubjectList: await gradeSubjectService.findAll()
            });
        });

        router.post("/phan-mon-thu-cong", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response)
        {
            const gradeId = <number> req.body["gradeid"];
            const subjectId = <number> req.body["subjectid"];
            var gs = await gradeSubjectService.checkExist(gradeId,subjectId);
            if(!gs)
                await gradeSubjectService.add(gradeId, subjectId);
            res.redirect("/phan-mon-cho-khoi");
        })

        router.post("/phan-mon-thu-cong", authentication.isAuthenticated, authentication.canAccess, 
            async function (req: Request, res: Response) {
                const gradeId = <number>req.body["gradeid"];
                const subjectId = <number>req.body["subjectid"];
                var gs = await gradeSubjectService.checkExist(gradeId, subjectId);
                if (!gs)
                    await gradeSubjectService.add(gradeId, subjectId);
                res.redirect("/phan-mon-cho-khoi");
            })
        
        router.get("/xoa-phan-cong", authentication.isAuthenticated, authentication.canAccess, 
            async function (req: Request, res: Response) {
                const gradeId : number = req.query["makhoi"];
                const subjectId : number = req.query["mamon"];
                var result :any = await gradeSubjectService.deleteGS(gradeId, subjectId);
                if(result.error_message)
                    req.flash("error_message",result.error_message)
                res.redirect("/phan-mon-cho-khoi");
            })

        router.post("/lay-chuong-theo-mon-khoi", authentication.isAuthenticated, authentication.canAccess, 
            async function (req: Request, res: Response) {
                const gradeSubjectId: number = req.body.gradeSubjectId;
                var results = await chapterService.getByGradeSubjectId(gradeSubjectId);
                res.json(results);
            })    
    }
}
