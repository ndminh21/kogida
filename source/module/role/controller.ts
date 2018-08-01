import { Authentication } from './../authentication/authentication';
import { Function } from './../../model/Function';
import { Role } from './../../model/Role';
import { Router, Request, Response } from 'express';
import GroupFunctionService from '../../service/database/GroupFunctionService'
import FunctionService from '../../service/database/FunctionService'
import RoleService from '../../service/database/RoleService'

export default class UtilizerController {
    public static route(router: Router) {
        var gfService : GroupFunctionService = new GroupFunctionService();
        var fnService : FunctionService = new FunctionService();
        var roleService : RoleService = new RoleService();
        var authentication = new Authentication()
        router.get("/quan-ly-chuc-danh", authentication.isAuthenticated, authentication.canAccess, async function (req: Request, res: Response) {
            var roleWithFunctions = await roleService.findAll()
            res.render("../module/role/view", {
                userInfo: req.user,
                roleWithFunctions: roleWithFunctions,
                gfWithFunctions: await gfService.findAll(),
                message_gf : req.flash("message_gf")
            });
        });

        router.post("/cap-nhat-chuc-danh", authentication.isAuthenticated, authentication.canAccess,  async function (req: Request, res: Response) {
            let role = req.body.role
            role.FunctionList = []
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
                if(role.RName == "")
                    delete role.RName;
                await roleService.updateById(role.RId, role);
            }
                
            res.redirect('/quan-ly-chuc-danh');
        });

        router.get("/xoa-chuc-nang-cua-chuc-danh", authentication.isAuthenticated, authentication.canAccess, async function (req: Request, res: Response) {
            const rId = req.query.role;
            const fId = req.query.func;
            const fn = await fnService.findById(fId);

            await roleService.removeFunction(rId,fn);
            
            res.redirect('/quan-ly-chuc-danh');
        });

        router.get("/xoa-chuc-danh", authentication.isAuthenticated, authentication.canAccess,  async function (req: Request, res: Response) {
            const rId = req.query.role;
            const role = await roleService.findById(rId);
            if (role.toJSON().FunctionList.length == 0)
                var result :any = await roleService.deleteById(rId);
                if (result.error_message)
                    req.flash("error_message", result.error_message)
            else
                req.flash("message_gf", "Không thể xóa được chức danh này.");

            res.redirect('/quan-ly-chuc-danh')
        });


    }
}