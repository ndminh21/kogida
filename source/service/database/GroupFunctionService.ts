import { Function } from './../../model/Function';
import { GroupFunction } from './../../model/GroupFunction';

export default class GroupFunctionService {

	constructor() {
	}
    
    public async addGroupFunction(gfName: string) {
        return new GroupFunction({GFName: gfName}).save();
    }

    public async findAll() {
        return GroupFunction.findAll({ 
            include: [Function], 
            order: [
                ["GFId", "ASC"]
            ]
        }); 
    };

    public async update(gfId: number, value: Object) {
        var gf = await GroupFunction.findOne({ where: { GFId: gfId } });
        return gf.updateAttributes(value); 
    }

    public async findById(gfId: number) {
        return GroupFunction.findOne({ where: { GFId: gfId }, include: [Function] });
    }

    public async deleteById(gfId: number) {
        try {
            var result = await GroupFunction.destroy({ where: { GFId: gfId } })
            return result
        }
        catch (e) {
            return ({ error_message: "Không thể xóa nhóm chức năng này" })
        }
    }

}