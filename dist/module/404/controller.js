"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error404Controller {
    static route(router) {
        router.get("/404", async function (req, res) {
            res.render("../module/404/view", {
                message: req.flash("backUrl")
            });
        });
    }
}
exports.default = Error404Controller;
