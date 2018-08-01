import { Role } from './../../model/Role';
import { Function } from './../../model/Function';

export default class RoleService {

    constructor() {
    }

    public async addRole(value) {
        var role = await new Role(value).save();
        return role.$add("FunctionList", value.FunctionList);
    }

    public async updateById(rId: Number, value: any) {
        var role = await Role.findOne({ where: { RId: rId } });
        await role.updateAttributes(value);
        return role.$add("FunctionList", value.FunctionList);
    }

    public async removeFunction(rId: Number, fn) {
        var role = await Role.findOne({ where: { RId: rId } });
        return role.$remove("FunctionList", fn);
    }

    public async findAll() {
        return Role.findAll({
            include: [Function]
        });
    };

    public async findById(rId: number) {
        return Role.findOne({ where: { RId: rId }, include: [Function] });
    }

    public async deleteById(rId: number) {
        try {
            var result = await Role.destroy({ where: { RId: rId } });
            return result
        }
        catch (e) {
            return ({ error_message: "Không thể xóa chức danh này" })
        }
        
    }
}