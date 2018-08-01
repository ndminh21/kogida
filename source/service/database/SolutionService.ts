import { Solution } from './../../model/Solution';
import { GradeSubject } from './../../model/GradeSubject';
import { Exercise } from './../../model/Exercise';
import { Chapter } from './../../model/Chapter';
import { Grade } from '../../model/Grade';
import { Subject } from '../../model/Subject';
import { User } from '../../model/User';

export default class SolutionService {

    constructor() {
    }

    public async add(data: any) {
        return new Solution(data).save();
    }
    public async update(SolutionId, data) {
        console.log(data)
        var sol = await Solution.findOne({ where: { SolutionId } });
        return sol.updateAttributes(data);
    }
    public async delete(SolutionId: number) {
        try {
            var result = await Solution.destroy({ where: { SolutionId } });
            return result
        } catch (e) {
            return ({ error_message: "Không thể xóa bài giải này" })
        }
    }

    public async getById(SolutionId: number){
        return Solution.findOne({
            include: [{
                model: Exercise
            }
        ],
            where: { SolutionId: SolutionId }
        });
    }
}
