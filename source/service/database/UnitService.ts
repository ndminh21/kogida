import { Unit } from './../../model/Unit';
import { GradeSubject } from './../../model/GradeSubject';
import { Chapter } from './../../model/Chapter';
import { Grade } from '../../model/Grade';
import { Subject } from '../../model/Subject';
import { User } from '../../model/User';
export default class UnitService {

    constructor() {
    }

    public async add(value: Object) {
        return new Unit(value).save();
    }

    public async findAll() {
        return Unit.findAll({
            include: [
                {
                    model: Chapter,
                    include: [
                        {
                            model:GradeSubject,
                            include:[
                                Grade,
                                Subject
                            ]
                        }
                    ],
                },
                {
                    model: User,
                    as: "CreatedUser"
                },
                {
                    model: User,
                    as: "UpdatedUser"
                }
            ]
        });
    }

    public async getById(UnitId : number){
        return Unit.findOne({
            include: [
                {
                    model: Chapter,
                    include: [
                        {
                            model:GradeSubject,
                            include:[
                                Grade,
                                Subject
                            ]
                        }
                    ],
                },
                {
                    model: User,
                    as: "CreatedUser"
                },
                {
                    model: User,
                    as: "UpdatedUser"
                }
            ],
            where : { UnitId }
        })
    }

    public async getByChapterId(ChapterId : number){
        return Unit.find({
            include: [
                {
                    model: Chapter,
                },
                {
                    model: User,
                    as: "CreatedUser"
                },
                {
                    model: User,
                    as: "UpdatedUser"
                }
            ],
            where : { ChapterId }
        })
    }


    public async update(UnitId: number, unitDetail) {
        var unit = await Unit.findById(UnitId);
        return unit.updateAttributes(unitDetail);
    }

    public async updateOrder(UnitId: number, UnitOrder: number) {
        var unit = await Unit.findById(UnitId);
        return unit.updateAttributes({ UnitOrder });
    }


    public async delete(UnitId: number) {
        try
        {
            var result = await Unit.destroy({ where: { UnitId } });
            return result
        }catch(e){
            return({error_message : "Không thể xóa bài học này"})
        } 
    }
}
