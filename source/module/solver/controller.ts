import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"

export default class SolverController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        
        router.get("/old/giai-pt-hpt", async function (req: Request, res: Response) {
            res.render("../module/solver/view", {
                gradeList: await gradeService.findAll()           
            });
        });
    }
}
