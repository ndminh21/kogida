import { Router, Request, Response } from 'express';

export default class Error404Controller {
    public static route(router: Router) {
        router.get("/404", async function (req: Request, res: Response) {
            res.render("../module/404/view",{
                message: req.flash("backUrl")
            });
        });
    }
}