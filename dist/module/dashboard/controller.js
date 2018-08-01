"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
class HomeController {
    static route(router) {
        var authentication = new authentication_1.Authentication();
        router.get("/trang-chinh", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/dashboard/view", {
                userInfo: req.user
            });
        });
    }
}
exports.default = HomeController;
