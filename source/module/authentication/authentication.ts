import { Request,Response } from 'express';
import RoleService from '../../service/database/RoleService'

export class Authentication{
    constructor(){  
        
    }

    public isAuthenticated(request: Request, response: Response, nextFunction) {
        if (request.isAuthenticated()){
            nextFunction()          
        }else{
            request.flash('redirectUrl', request.url)
            if (request.route.methods.get)
                request.flash('method', 'get')
            response.redirect('/dang-nhap')
        }
    }

    public async canAccess(request, response : Response, nextFunction) {
        if (request.user.UserId == "admin")
            nextFunction()
        else
        {
            var roleService = new RoleService()
            var method = ''
            if (request.route.methods.get)
                method = 'get'
            else
                method = 'post'    
            var path = request.route.path
            var role = await roleService.findById(request.user.Role.RId)
            var functionList = role.toJSON().FunctionList
            var found = functionList.findIndex(x => x.FMethod == method && x.FUrl == path)
        
            if (found != -1)
                nextFunction()
            else
                response.redirect('/404')
        }        
    }

}