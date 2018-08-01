"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grade_1 = require("./../../model/Grade");
const Exam_1 = require("./../../model/Exam");
const GradeSubject_1 = require("../../model/GradeSubject");
const Subject_1 = require("../../model/Subject");
class ExamService {
    constructor() {
    }
    async add(data) {
        return new Exam_1.Exam(data).save();
    }
    async update(ExamId, data) {
        var exam = await Exam_1.Exam.findOne({ where: { ExamId } });
        return exam.updateAttributes(data);
    }
    async togglePublished(ExamId) {
        var exam = await Exam_1.Exam.findOne({ where: { ExamId } });
        return exam.updateAttributes({ IsPublished: !exam.toJSON().IsPublished });
    }
    async findAll() {
        return Exam_1.Exam.findAll({
            include: [{
                    model: GradeSubject_1.GradeSubject,
                    include: [
                        Grade_1.Grade,
                        Subject_1.Subject
                    ]
                },]
        });
    }
    ;
    async getExamByCreatedUser(CreatedBy) {
        return Exam_1.Exam.findAll({
            where: { CreatedBy },
            include: [{
                    model: GradeSubject_1.GradeSubject,
                    include: [
                        Grade_1.Grade,
                        Subject_1.Subject
                    ]
                },]
        });
    }
    ;
    async getExamBySecrett(Secret) {
        return Exam_1.Exam.findOne({
            where: { Secret }
        });
    }
    async delete(ExamId) {
        try {
            var result = await Exam_1.Exam.destroy({ where: { ExamId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể  xóa bài thi này" });
        }
    }
    async getById(ExamId) {
        return Exam_1.Exam.findOne({
            where: { ExamId }
        });
    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    async getExamForTest(ExamId) {
        var exam = await Exam_1.Exam.findOne({ where: { ExamId } });
        var examJSON = exam.toJSON();
        var i = 0;
        var QuestionList = JSON.parse(examJSON.QuestionList);
        var Structure = JSON.parse(examJSON.Structure);
        var Question = [];
        if (Structure.QuestionWithLabelAndNumberList.length < 2)
            Question = this.shuffle(QuestionList).slice(0, Number(Structure.QuestionNumber));
        else {
            Structure.QuestionWithLabelAndNumberList.map(x => {
                var QuestionWithType = QuestionList.filter(y => y.Label === x.label);
                Question = Question.concat(this.shuffle(QuestionWithType).slice(0, Number(x.number)));
            });
        }
        return this.shuffle(Question.map(x => {
            if (x.AllowRandom == true)
                x.SolutionList = this.shuffle(x.SolutionList);
            return x;
        }));
    }
}
exports.default = ExamService;
