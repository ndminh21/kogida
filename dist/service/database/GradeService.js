"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grade_1 = require("./../../model/Grade");
const GradeSubjectService_1 = require("./GradeSubjectService");
class GradeService {
    constructor() {
    }
    async addGrade(gradeName) {
        return new Grade_1.Grade({ GradeName: gradeName }).save();
    }
    async findAll() {
        let gradeSubjectService = new GradeSubjectService_1.default();
        var allGrade = await Grade_1.Grade.findAll();
        return Promise.all(allGrade.map(async (x) => {
            var gradeSubject = await gradeSubjectService.getByGradeId(x.toJSON().GradeId);
            var subjectList = gradeSubject.map((x) => x.toJSON().subject);
            return Object.assign({}, x.toJSON(), { subjectList });
        }));
    }
    async findById(gradeId) {
        return Grade_1.Grade.findById(gradeId);
    }
    async updateName(gradeId, gradeName) {
        var grade = await Grade_1.Grade.findById(gradeId);
        return grade.updateAttributes({ GradeName: gradeName });
    }
    async deleteGrade(gradeId) {
        try {
            var result = await Grade_1.Grade.destroy({ where: { GradeId: gradeId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa khối/lớp này" });
        }
    }
}
exports.default = GradeService;
