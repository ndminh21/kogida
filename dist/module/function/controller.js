"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GroupFunctionService_1 = require("../../service/database/GroupFunctionService");
const FunctionService_1 = require("../../service/database/FunctionService");
class FunctionController {
    static route(router) {
        let gfService = new GroupFunctionService_1.default();
        let fnService = new FunctionService_1.default();
        let authentication = new authentication_1.Authentication();
        router.get("/quan-ly-chuc-nang", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            res.render("../module/function/view", {
                userInfo: req.user,
                gfList: await gfService.findAll(),
                functionList: await fnService.findAll(),
                message_function: req.flash("message_function"),
                message_gf: req.flash("message_gf")
            });
        });
        router.post("/cap-nhat-cum-chuc-nang", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var groupFunction = req.body.gf;
            if (groupFunction.GFId === "-1")
                await gfService.addGroupFunction(groupFunction.GFName);
            else
                await gfService.update(groupFunction.GFId, {
                    GFName: groupFunction.GFName
                });
            res.redirect("/quan-ly-chuc-nang");
        });
        router.post("/cap-nhat-chuc-nang", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var fn = req.body.function;
            fn.GFunction = await gfService.findById(fn.GFId);
            if (fn.FId === "-1") {
                delete fn.FId;
                await fnService.addFunction(fn);
            }
            else
                await fnService.update(fn.FId, fn);
            res.redirect("/quan-ly-chuc-nang");
        });
        router.get("/xoa-chuc-nang", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var fId = req.query.id;
            if (fId === "-1")
                req.flash("message_function", "Bạn chưa chọn chức năng cần xoá");
            else
                await fnService.deleteById(fId);
            res.redirect("/quan-ly-chuc-nang");
        });
        router.get("/xoa-cum-chuc-nang", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var gfId = req.query.id;
            if (gfId === "-1")
                req.flash("message_gf", "Bạn chưa chọn cụm chức năng cần xoá");
            else {
                var gf = await gfService.findById(gfId);
                if (gf.toJSON().FunctionList.length != 0)
                    req.flash("message_gf", "Cụm chức năng này còn tồn tại chức năng");
                else {
                    var result = await gfService.deleteById(gfId);
                    if (result.error_message)
                        req.flash("error_message", result.error_message);
                }
            }
            res.redirect("/quan-ly-chuc-nang");
        });
    }
}
exports.default = FunctionController;
