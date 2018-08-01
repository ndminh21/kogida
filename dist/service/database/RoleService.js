"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = require("./../../model/Role");
const Function_1 = require("./../../model/Function");
class RoleService {
    constructor() {
    }
    async addRole(value) {
        var role = await new Role_1.Role(value).save();
        return role.$add("FunctionList", value.FunctionList);
    }
    async updateById(rId, value) {
        var role = await Role_1.Role.findOne({ where: { RId: rId } });
        await role.updateAttributes(value);
        return role.$add("FunctionList", value.FunctionList);
    }
    async removeFunction(rId, fn) {
        var role = await Role_1.Role.findOne({ where: { RId: rId } });
        return role.$remove("FunctionList", fn);
    }
    async findAll() {
        return Role_1.Role.findAll({
            include: [Function_1.Function]
        });
    }
    ;
    async findById(rId) {
        return Role_1.Role.findOne({ where: { RId: rId }, include: [Function_1.Function] });
    }
    async deleteById(rId) {
        try {
            var result = await Role_1.Role.destroy({ where: { RId: rId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa chức danh này" });
        }
    }
}
exports.default = RoleService;
