import { Grade } from './../../model/Grade';
import { Exam } from './../../model/Exam';
import { GradeSubject } from '../../model/GradeSubject';
import { Subject } from '../../model/Subject';

export default class ExamService {

    constructor() {
    }

    public async add(data: any) {
        return new Exam(data).save();
    }

    public async update(ExamId, data) {
        var exam = await Exam.findOne({ where: { ExamId } });
        return exam.updateAttributes(data);
    }
    public async togglePublished(ExamId) {
        var exam = await Exam.findOne({ where: { ExamId } });
        return exam.updateAttributes({ IsPublished : !exam.toJSON().IsPublished});
    }
    public async findAll() {
        return Exam.findAll({
            include: [{
                model: GradeSubject,
                include: [
                    Grade,
                    Subject
                ]
            },]
        });
    };

    public async getExamByCreatedUser(CreatedBy) {
        return Exam.findAll({
            where : {CreatedBy},
            include: [{
                model: GradeSubject,
                include: [
                    Grade,
                    Subject
                ]
            },]
        });
    };

    public async getExamBySecrett(Secret){
        return Exam.findOne({
            where: { Secret }
        });
    }

    public async delete(ExamId: number) {
        try {
            var result = await Exam.destroy({ where: { ExamId } });
            return result
        } catch (e) {
            return ({ error_message: "Không thể  xóa bài thi này" })
        }
    }

    public async getById(ExamId: number) {
        return Exam.findOne({
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

    public async getExamForTest(ExamId){
        var exam = await Exam.findOne({ where: { ExamId } });
        var examJSON = exam.toJSON();
        var i = 0;
        var QuestionList = JSON.parse(examJSON.QuestionList)
        var Structure = JSON.parse(examJSON.Structure)
        var Question = []
        if(Structure.QuestionWithLabelAndNumberList.length < 2)
            Question = this.shuffle(QuestionList).slice(0,Number(Structure.QuestionNumber));
        else{
            Structure.QuestionWithLabelAndNumberList.map(x =>{
                var QuestionWithType = QuestionList.filter(y => y.Label === x.label)
                Question = Question.concat(this.shuffle(QuestionWithType).slice(0, Number(x.number)));
            })
        }
        return this.shuffle(Question.map(x =>{
            if(x.AllowRandom == true)
                x.SolutionList = this.shuffle(x.SolutionList)
            return x
        }))
    }
}
