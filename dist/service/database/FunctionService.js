"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Function_1 = require("./../../model/Function");
const GroupFunction_1 = require("./../../model/GroupFunction");
class FunctionService {
    constructor() {
    }
    async addFunction(value) {
        return new Function_1.Function(value).save();
    }
    async findAll() {
        return Function_1.Function.findAll({ include: [GroupFunction_1.GroupFunction] });
    }
    async update(fId, value) {
        var fn = await Function_1.Function.findOne({ where: { FId: fId } });
        return fn.updateAttributes(value);
    }
    async deleteById(fId) {
        try {
            var result = await Function_1.Function.destroy({ where: { FId: fId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa chương này" });
        }
    }
    async findById(fId) {
        return Function_1.Function.findOne({ where: { FId: fId } });
    }
}
exports.default = FunctionService;
