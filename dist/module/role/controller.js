"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GroupFunctionService_1 = require("../../service/database/GroupFunctionService");
const FunctionService_1 = require("../../service/database/FunctionService");
const RoleService_1 = require("../../service/database/RoleService");
class UtilizerController {
    static route(router) {
        var gfService = new GroupFunctionService_1.default();
        var fnService = new FunctionService_1.default();
        var roleService = new RoleService_1.default();
        var authentication = new authentication_1.Authentication();
        router.get("/quan-ly-chuc-danh", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var roleWithFunctions = await roleService.findAll();
            res.render("../module/role/view", {
                userInfo: req.user,
                roleWithFunctions: roleWithFunctions,
                gfWithFunctions: await gfService.findAll(),
                message_gf: req.flash("message_gf")
            });
        });
        router.post("/cap-nhat-chuc-danh", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let role = req.body.role;
            role.FunctionList = [];
            if (role.functionIds) {
                for (var index = 0; index < role.functionIds.length; index++) {
                    let fn = await fnService.findById(role.functionIds[index]);
                    role.FunctionList.push(fn);
                }
            }
            if (role.RId === "-1") {
                delete role.RId;
                var newRole = await roleService.addRole(role);
            }
            else {
                if (role.RName == "")
                    delete role.RName;
                await roleService.updateById(role.RId, role);
            }
            res.redirect('/quan-ly-chuc-danh');
        });
        router.get("/xoa-chuc-nang-cua-chuc-danh", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const rId = req.query.role;
            const fId = req.query.func;
            const fn = await fnService.findById(fId);
            await roleService.removeFunction(rId, fn);
            res.redirect('/quan-ly-chuc-danh');
        });
        router.get("/xoa-chuc-danh", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            const rId = req.query.role;
            const role = await roleService.findById(rId);
            if (role.toJSON().FunctionList.length == 0)
                var result = await roleService.deleteById(rId);
            if (result.error_message)
                req.flash("error_message", result.error_message);
            else
                req.flash("message_gf", "Không thể xóa được chức danh này.");
            res.redirect('/quan-ly-chuc-danh');
        });
    }
}
exports.default = UtilizerController;
