"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("./../../model/Subject");
const GradeSubject_1 = require("./../../model/GradeSubject");
const Grade_1 = require("../../model/Grade");
class GradeSubjectService {
    constructor() {
    }
    async add(gradeId, subjectId) {
        return new GradeSubject_1.GradeSubject({ GradeId: gradeId, SubjectId: subjectId }).save();
    }
    async getById(gradeSubjectId) {
        return GradeSubject_1.GradeSubject.findAll({ include: [Grade_1.Grade, Subject_1.Subject], where: { Id: gradeSubjectId } });
    }
    async getByGradeId(gradeId) {
        return GradeSubject_1.GradeSubject.findAll({ include: [Subject_1.Subject], where: { GradeId: gradeId } });
    }
    async checkExist(gradeId, subjectId) {
        return GradeSubject_1.GradeSubject.findOne({ where: { GradeId: gradeId, SubjectId: subjectId } });
    }
    async findAll() {
        return GradeSubject_1.GradeSubject.findAll({ include: [Grade_1.Grade, Subject_1.Subject] });
    }
    async deleteGS(gradeId, subjectId) {
        try {
            var result = await GradeSubject_1.GradeSubject.destroy({ where: { GradeId: gradeId, SubjectId: subjectId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể  phân công môn học này" });
        }
    }
}
exports.default = GradeSubjectService;
