import { Router, Request, Response } from "express";
import { Authentication } from './../authentication/authentication';



export default class HomeController {
    public static route(router: Router): void {
        var authentication = new Authentication();

        router.get("/trang-chinh", authentication.isAuthenticated, authentication.canAccess ,async function(req: Request, res: Response) {
            res.render("../module/dashboard/view", {
                userInfo: req.user
            });
        });
    }
}
