"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("./../../model/Subject");
class SubjectService {
    constructor() {
    }
    async addSubject(subjectName) {
        return new Subject_1.Subject({ SubjectName: subjectName }).save();
    }
    async findAll() {
        return Subject_1.Subject.findAll();
    }
    async findById(subjectId) {
        return Subject_1.Subject.findById(subjectId);
    }
    async updateName(subjectId, subjectName) {
        var subject = await Subject_1.Subject.findById(subjectId);
        return subject.updateAttributes({ SubjectName: subjectName });
    }
    async deleteSubject(subjectId) {
        try {
            var result = await Subject_1.Subject.destroy({ where: { SubjectId: subjectId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa môn học này" });
        }
    }
}
exports.default = SubjectService;
