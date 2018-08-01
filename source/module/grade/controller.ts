import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import GradeSerivce from '../../service/database/GradeService'


export default class GradeController {
    public static route(router: Router): void {
        let gradeService : GradeSerivce = new GradeSerivce();
        let authentication = new Authentication()
        router.get("/quan-ly-khoi-lop", authentication.isAuthenticated, authentication.canAccess,
        async function (req: Request, res: Response) {
            res.render("../module/grade/view", {
                userInfo: req.user,
                message: "",
                gradeList: await gradeService.findAll()
            });
        });

        router.get("/tao-khoi-lop-moi", authentication.isAuthenticated, authentication.canAccess,
        async function (req: Request, res: Response) {
            var gradeName = req.query["ten"];
            await gradeService.addGrade(gradeName);
            res.redirect("/quan-ly-khoi-lop");
        });

        router.get("/sua-ten-khoi-lop", authentication.isAuthenticated, authentication.canAccess,
        async function (req: Request, res: Response) {
            let gradeId : number = req.query["ma"];
            let gradeName : string = req.query["ten"];
            await gradeService.updateName(gradeId, gradeName); 
            res.redirect("/quan-ly-khoi-lop");            
        });

        router.get("/xoa-khoi-lop", authentication.isAuthenticated, authentication.canAccess,
        async function (req: Request, res: Response) {
            let gradeId : number = req.query["ma"];
            var result : any = await gradeService.deleteGrade(gradeId); 
            if(result.error_message)
                req.flash("error_message",result.error_message)
            res.redirect("/quan-ly-khoi-lop");            
        });



    }
}
