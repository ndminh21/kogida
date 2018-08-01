import { Function } from './../../model/Function';
import { GroupFunction } from './../../model/GroupFunction';

export default class FunctionService {

    constructor() {
    }

    public async addFunction(value: JSON) {
        return new Function(value).save();
    }

    public async findAll() {
        return Function.findAll({include : [GroupFunction]});
    }


    public async update(fId: number, value: Object) {
        var fn = await Function.findOne({ where: { FId: fId } });
        return fn.updateAttributes(value);
    }

    public async deleteById(fId: number) {
        try {
            var result = await Function.destroy({ where: { FId: fId } });
            return result
        }
        catch (e) {
            return ({ error_message: "Không thể xóa chương này" })
        }
    }

    public async findById(fId: number) {
        return Function.findOne({ where: { FId: fId } });
    }

}