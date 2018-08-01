import { Authentication } from './../authentication/authentication';
import { Router, Request, Response } from 'express';
import { Subdivision } from './../../model/Subdivision';
import SubdivisionService from '../../service/database/SubdivisionService';
import UserService from '../../service/database/UserService';
import RoleService from '../../service/database/RoleService';
import AccountService from '../../service/database/AccountService';
import * as moment from 'moment'

export default class AccountAllocationController {
    public static route(router: Router) {
        var subdivisionService : SubdivisionService = new SubdivisionService();
        var userService = new UserService();
        var roleService = new RoleService();
        var accountService = new AccountService();
        var authentication = new Authentication()

        router.get("/cap-phat-tai-khoan",
        authentication.isAuthenticated,authentication.canAccess, 
        async function (req: Request, res: Response) {
            var allocatedsUser = await userService.getAllocatedUsers()
            res.render("../module/account-allocation/view", {
                userInfo: req.user,
                allocatedUsers: allocatedsUser,
                roleList: await roleService.findAll()
            });
        })

        router.post("/cap-phat-tai-khoan-moi",
        authentication.isAuthenticated, authentication.canAccess,  async function (req: Request, res: Response) {
            let user = req.body.user
            let account = req.body.account
            var checkUserExist = await userService.findById(user.UserId)
            if(checkUserExist){

            }else{
                user.Birthday = moment(user.Birthday,'DD/MM/YYYY',true)
                account.Provider = "local"
                account.Allocated = true
                account.Banned = false
                var userModel = await userService.addUser(user)
                account.UserId = userModel.toJSON().UserId
                var accountModel = await accountService.addUser(account)
            }
            
            res.redirect('/cap-phat-tai-khoan')   
        })

        router.get("/xoa-tai-khoan-cap-phat", 
            authentication.isAuthenticated, authentication.canAccess, async function (req: Request, res: Response) {
            let userId = req.query.userid
            var account = await accountService.findById(userId)
            if (account){
                if (account.toJSON().Allocated == true){
                    await accountService.deleteById(userId)
                    await userService.deleteById(userId)
                }else
                    req.flash("message_delete"," Tài khoản không phải của hệ thống tạo ra")
            }else
                req.flash("message_delete", " Tài khoản đã bị người khác gỡ bỏ khỏi hệ thống")

            res.redirect('/cap-phat-tai-khoan')
        })
    }
}
