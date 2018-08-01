import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import SubjectService from '../../service/database/SubjectService'


export default class SubjectController {
    public static route(router: Router): void {
        let subjectService : SubjectService = new SubjectService();
        let authentication = new Authentication()
        router.get("/quan-ly-mon-hoc", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            res.render("../module/subject/view", {
                userInfo: req.user,
                subjectList: await subjectService.findAll()
            });
        });

        router.get("/tao-mon-hoc-moi", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            var subjectName = req.query["ten"];
            await subjectService.addSubject(subjectName);
            res.redirect("/quan-ly-mon-hoc");
        });

        router.get("/sua-ten-mon-hoc", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            let subjectId : number = req.query["ma"];
            let subjectName : string = req.query["ten"];
            await subjectService.updateName(subjectId, subjectName); 
            res.redirect("/quan-ly-mon-hoc");            
        });

        router.get("/xoa-mon-hoc", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            let subjectId : number = req.query["ma"];        
            var result : any = await subjectService.deleteSubject(subjectId); 
            if (result.error_message)
                req.flash("error_message", result.error_message)
            res.redirect("/quan-ly-mon-hoc");            
        });
    }
}
