"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unit_1 = require("./../../model/Unit");
const GradeSubject_1 = require("./../../model/GradeSubject");
const Chapter_1 = require("./../../model/Chapter");
const Grade_1 = require("../../model/Grade");
const Subject_1 = require("../../model/Subject");
const User_1 = require("../../model/User");
class UnitService {
    constructor() {
    }
    async add(value) {
        return new Unit_1.Unit(value).save();
    }
    async findAll() {
        return Unit_1.Unit.findAll({
            include: [
                {
                    model: Chapter_1.Chapter,
                    include: [
                        {
                            model: GradeSubject_1.GradeSubject,
                            include: [
                                Grade_1.Grade,
                                Subject_1.Subject
                            ]
                        }
                    ],
                },
                {
                    model: User_1.User,
                    as: "CreatedUser"
                },
                {
                    model: User_1.User,
                    as: "UpdatedUser"
                }
            ]
        });
    }
    async getById(UnitId) {
        return Unit_1.Unit.findOne({
            include: [
                {
                    model: Chapter_1.Chapter,
                    include: [
                        {
                            model: GradeSubject_1.GradeSubject,
                            include: [
                                Grade_1.Grade,
                                Subject_1.Subject
                            ]
                        }
                    ],
                },
                {
                    model: User_1.User,
                    as: "CreatedUser"
                },
                {
                    model: User_1.User,
                    as: "UpdatedUser"
                }
            ],
            where: { UnitId }
        });
    }
    async getByChapterId(ChapterId) {
        return Unit_1.Unit.find({
            include: [
                {
                    model: Chapter_1.Chapter,
                },
                {
                    model: User_1.User,
                    as: "CreatedUser"
                },
                {
                    model: User_1.User,
                    as: "UpdatedUser"
                }
            ],
            where: { ChapterId }
        });
    }
    async update(UnitId, unitDetail) {
        var unit = await Unit_1.Unit.findById(UnitId);
        return unit.updateAttributes(unitDetail);
    }
    async updateOrder(UnitId, UnitOrder) {
        var unit = await Unit_1.Unit.findById(UnitId);
        return unit.updateAttributes({ UnitOrder });
    }
    async delete(UnitId) {
        try {
            var result = await Unit_1.Unit.destroy({ where: { UnitId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa bài học này" });
        }
    }
}
exports.default = UnitService;
