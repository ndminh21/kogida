"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unit_1 = require("./../../model/Unit");
const GradeSubject_1 = require("./../../model/GradeSubject");
const Chapter_1 = require("./../../model/Chapter");
const Grade_1 = require("../../model/Grade");
const Subject_1 = require("../../model/Subject");
const User_1 = require("../../model/User");
const Exercise_1 = require("../../model/Exercise");
class ChapterService {
    constructor() {
    }
    async addChapter(value) {
        return new Chapter_1.Chapter(value).save();
    }
    async getById(ChapterId) {
        return Chapter_1.Chapter.findOne({
            include: [
                {
                    model: GradeSubject_1.GradeSubject,
                    include: [
                        Grade_1.Grade,
                        Subject_1.Subject
                    ]
                },
                {
                    model: User_1.User,
                    as: "CreatedUser"
                },
                {
                    model: User_1.User,
                    as: "UpdatedUser"
                }, Unit_1.Unit, Exercise_1.Exercise
            ],
            where: { ChapterId }
        });
    }
    async findAll() {
        return Chapter_1.Chapter.findAll({
            include: [
                {
                    model: GradeSubject_1.GradeSubject,
                    include: [
                        Grade_1.Grade,
                        Subject_1.Subject
                    ]
                },
                {
                    model: User_1.User,
                    as: "CreatedUser"
                },
                {
                    model: User_1.User,
                    as: "UpdatedUser"
                }, Unit_1.Unit, Exercise_1.Exercise
            ],
            order: [[{ model: Exercise_1.Exercise, as: "ExerciseList" }, "CreatedAt", "ASC"]]
        });
    }
    async getByGradeSubjectId(gradeSubjectId) {
        return Chapter_1.Chapter.findAll({
            include: [
                {
                    model: GradeSubject_1.GradeSubject,
                    include: [
                        Grade_1.Grade,
                        Subject_1.Subject
                    ]
                },
                {
                    model: User_1.User,
                    as: "CreatedUser"
                },
                {
                    model: User_1.User,
                    as: "UpdatedUser"
                }, Unit_1.Unit, Exercise_1.Exercise
            ],
            where: { GSId: gradeSubjectId },
            order: [[{ model: Exercise_1.Exercise, as: "ExerciseList" }, "CreatedAt", "ASC"]]
        });
    }
    async getByGradeIdAndSubjectId(gradeId, subjectId) {
        return Chapter_1.Chapter.findAll({
            include: [{
                    model: GradeSubject_1.GradeSubject,
                    include: [
                        Grade_1.Grade,
                        Subject_1.Subject
                    ],
                    where: {
                        GradeId: gradeId,
                        SubjectId: subjectId
                    }
                },
                {
                    model: User_1.User,
                    as: "CreatedUser"
                },
                {
                    model: User_1.User,
                    as: "UpdatedUser"
                },
                {
                    model: Unit_1.Unit,
                    as: "UnitList"
                },
                Exercise_1.Exercise
            ],
            order: [[{ model: Exercise_1.Exercise, as: "ExerciseList" }, "CreatedAt", "ASC"]]
        });
    }
    async update(chapterId, chapterDetail) {
        var chapter = await Chapter_1.Chapter.findById(chapterId);
        return chapter.updateAttributes(chapterDetail);
    }
    async updateName(chapterId, chapterName) {
        var chapter = await Chapter_1.Chapter.findById(chapterId);
        return chapter.updateAttributes({ ChapterName: chapterName });
    }
    async updateOrder(chapterId, chapterOrder) {
        var chapter = await Chapter_1.Chapter.findById(chapterId);
        return chapter.updateAttributes({ ChapterOrder: chapterOrder });
    }
    async deleteChapter(chapterId) {
        try {
            var result = await Chapter_1.Chapter.destroy({ where: { ChapterId: chapterId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa chương này" });
        }
    }
}
exports.default = ChapterService;
