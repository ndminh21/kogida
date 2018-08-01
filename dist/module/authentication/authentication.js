"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoleService_1 = require("../../service/database/RoleService");
class Authentication {
    constructor() {
    }
    isAuthenticated(request, response, nextFunction) {
        if (request.isAuthenticated()) {
            nextFunction();
        }
        else {
            request.flash('redirectUrl', request.url);
            if (request.route.methods.get)
                request.flash('method', 'get');
            response.redirect('/dang-nhap');
        }
    }
    async canAccess(request, response, nextFunction) {
        if (request.user.UserId == "admin")
            nextFunction();
        else {
            var roleService = new RoleService_1.default();
            var method = '';
            if (request.route.methods.get)
                method = 'get';
            else
                method = 'post';
            var path = request.route.path;
            var role = await roleService.findById(request.user.Role.RId);
            var functionList = role.toJSON().FunctionList;
            var found = functionList.findIndex(x => x.FMethod == method && x.FUrl == path);
            if (found != -1)
                nextFunction();
            else
                response.redirect('/404');
        }
    }
}
exports.Authentication = Authentication;
