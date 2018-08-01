"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Solution_1 = require("./../../model/Solution");
const Exercise_1 = require("./../../model/Exercise");
class SolutionService {
    constructor() {
    }
    async add(data) {
        return new Solution_1.Solution(data).save();
    }
    async update(SolutionId, data) {
        console.log(data);
        var sol = await Solution_1.Solution.findOne({ where: { SolutionId } });
        return sol.updateAttributes(data);
    }
    async delete(SolutionId) {
        try {
            var result = await Solution_1.Solution.destroy({ where: { SolutionId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa bài giải này" });
        }
    }
    async getById(SolutionId) {
        return Solution_1.Solution.findOne({
            include: [{
                    model: Exercise_1.Exercise
                }
            ],
            where: { SolutionId: SolutionId }
        });
    }
}
exports.default = SolutionService;
