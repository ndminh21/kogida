"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const SubdivisionService_1 = require("../../service/database/SubdivisionService");
const UserService_1 = require("../../service/database/UserService");
const RoleService_1 = require("../../service/database/RoleService");
const AccountService_1 = require("../../service/database/AccountService");
const moment = require("moment");
class AccountAllocationController {
    static route(router) {
        var subdivisionService = new SubdivisionService_1.default();
        var userService = new UserService_1.default();
        var roleService = new RoleService_1.default();
        var accountService = new AccountService_1.default();
        var authentication = new authentication_1.Authentication();
        router.get("/cap-phat-tai-khoan", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            var allocatedsUser = await userService.getAllocatedUsers();
            res.render("../module/account-allocation/view", {
                userInfo: req.user,
                allocatedUsers: allocatedsUser,
                roleList: await roleService.findAll()
            });
        });
        router.post("/cap-phat-tai-khoan-moi", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let user = req.body.user;
            let account = req.body.account;
            var checkUserExist = await userService.findById(user.UserId);
            if (checkUserExist) {
            }
            else {
                user.Birthday = moment(user.Birthday, 'DD/MM/YYYY', true);
                account.Provider = "local";
                account.Allocated = true;
                account.Banned = false;
                var userModel = await userService.addUser(user);
                account.UserId = userModel.toJSON().UserId;
                var accountModel = await accountService.addUser(account);
            }
            res.redirect('/cap-phat-tai-khoan');
        });
        router.get("/xoa-tai-khoan-cap-phat", authentication.isAuthenticated, authentication.canAccess, async function (req, res) {
            let userId = req.query.userid;
            var account = await accountService.findById(userId);
            if (account) {
                if (account.toJSON().Allocated == true) {
                    await accountService.deleteById(userId);
                    await userService.deleteById(userId);
                }
                else
                    req.flash("message_delete", " Tài khoản không phải của hệ thống tạo ra");
            }
            else
                req.flash("message_delete", " Tài khoản đã bị người khác gỡ bỏ khỏi hệ thống");
            res.redirect('/cap-phat-tai-khoan');
        });
    }
}
exports.default = AccountAllocationController;
