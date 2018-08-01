import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import SubjectService from '../../service/database/SubjectService'
import GradeService from '../../service/database/GradeService'
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ChapterService from '../../service/database/ChapterService';
import UnitService from '../../service/database/UnitService'
export default class UnitController {
    public static route(router: Router): void {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let gradeSubjectService: GradeSubjectService = new GradeSubjectService();
        let chapterService: ChapterService = new ChapterService();
        var authentication = new Authentication()
        let unitService = new UnitService()
        router.get("/thong-tin-ve-bai-hoc", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            res.render("../module/unit/view", {
                userInfo: req.user,
                gradeList: await gradeService.findAll(),
                subjectList: await subjectService.findAll(),
                gradeSubjectList: await gradeSubjectService.findAll(),
                chapterList: await chapterService.findAll(),
                unitList: await unitService.findAll()
            });
        });

        router.post("/tao-bai-hoc-moi", authentication.isAuthenticated, authentication.canAccess,
            async function (req: Request, res: Response) {
                var newUnit :any = {}
                newUnit.ChapterId = req.body["chapterId"]
                newUnit.UnitName = req.body["unitname"]
                newUnit.UnitOrder = req.body["unitorder"]
                newUnit.Content = req.body["content"]
                newUnit.CreatedBy = req.user.UserId
                newUnit.UpdatedBy = req.user.UserId 
                await unitService.add(newUnit)
                res.redirect('/thong-tin-ve-bai-hoc')
            });

        router.get("/sua-bai-hoc", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            let unitId: number = req.query["ma"];

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


        router.post("/sua-bai-hoc", authentication.isAuthenticated, authentication.canAccess,
            async function (req: Request, res: Response) {
                var unitId = req.body["unitid"]
                var unit: any = {}
                unit.UnitName = req.body["unitname"]
                unit.UnitOrder = req.body["unitorder"]
                unit.Content = req.body["content"]
                unit.UpdatedBy = req.user.UserId
                await unitService.update(unitId,unit)
                res.redirect('/thong-tin-ve-bai-hoc')
            });
    }
}
