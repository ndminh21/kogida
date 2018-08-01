"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Function_1 = require("./../../model/Function");
const GroupFunction_1 = require("./../../model/GroupFunction");
class GroupFunctionService {
    constructor() {
    }
    async addGroupFunction(gfName) {
        return new GroupFunction_1.GroupFunction({ GFName: gfName }).save();
    }
    async findAll() {
        return GroupFunction_1.GroupFunction.findAll({
            include: [Function_1.Function],
            order: [
                ["GFId", "ASC"]
            ]
        });
    }
    ;
    async update(gfId, value) {
        var gf = await GroupFunction_1.GroupFunction.findOne({ where: { GFId: gfId } });
        return gf.updateAttributes(value);
    }
    async findById(gfId) {
        return GroupFunction_1.GroupFunction.findOne({ where: { GFId: gfId }, include: [Function_1.Function] });
    }
    async deleteById(gfId) {
        try {
            var result = await GroupFunction_1.GroupFunction.destroy({ where: { GFId: gfId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa nhóm chức năng này" });
        }
    }
}
exports.default = GroupFunctionService;
