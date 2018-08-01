import { Unit } from './../../model/Unit';
import { GradeSubject } from './../../model/GradeSubject';
import { Chapter } from './../../model/Chapter';
import { Grade } from '../../model/Grade';
import { Subject } from '../../model/Subject';
import { User } from '../../model/User';
import { Exercise } from '../../model/Exercise';

export default class ChapterService {

	constructor() {
	}
    
    public async addChapter(value :Object) {
        return new Chapter(value).save();
    }

    public async getById(ChapterId) {
        return Chapter.findOne({
            include: [
                {
                    model: GradeSubject,
                    include: [
                        Grade,
                        Subject
                    ]
                },
                {
                    model: User,
                    as: "CreatedUser"
                },
                {
                    model: User,
                    as: "UpdatedUser"
                }, Unit, Exercise
            ],
            where : {ChapterId}
        });
    }
    public async findAll(){
        return Chapter.findAll({
            include: [
                {
                    model: GradeSubject,
                    include:[
                        Grade,
                        Subject
                    ]
                },
                {
                    model: User,
                    as: "CreatedUser"
                },
                {
                    model: User,
                    as: "UpdatedUser"
                }, Unit, Exercise
            ],
            order: [[{ model: Exercise, as: "ExerciseList" },"CreatedAt","ASC"]]
            
        });
    }
    public async getByGradeSubjectId(gradeSubjectId: number) {
        return Chapter.findAll({
            include: [
                {
                    model: GradeSubject,
                    include:[
                        Grade,
                        Subject
                    ]
                },
                {
                    model: User,
                    as: "CreatedUser"
                },
                {
                    model: User,
                    as: "UpdatedUser"
                }, Unit, Exercise
            ],
            where:{GSId : gradeSubjectId},
            order: [[{ model: Exercise, as: "ExerciseList" }, "CreatedAt", "ASC"]]
        });
    }

    public async getByGradeIdAndSubjectId(gradeId: number, subjectId : number) {
        return Chapter.findAll({
            include: [{
                model: GradeSubject,
                include: [
                    Grade,
                    Subject
                ],
                where : {
                    GradeId : gradeId,
                    SubjectId : subjectId
                }
            }, 
            {
                model: User,
                as: "CreatedUser"
            },
            {
                model: User,
                as: "UpdatedUser"
            }, 
            {   
                model: Unit,
                as: "UnitList"
            }, 
            Exercise
            ],
            order: [[{ model: Exercise, as: "ExerciseList" }, "CreatedAt", "ASC"]]
        });
    }

    public async update(chapterId: number, chapterDetail) {
        var chapter = await Chapter.findById(chapterId);
        return chapter.updateAttributes(chapterDetail);
    }
    public async updateName(chapterId: number, chapterName: string) {
        var chapter = await Chapter.findById(chapterId);
        return chapter.updateAttributes({ ChapterName: chapterName });
    }

    public async updateOrder(chapterId: number, chapterOrder: number) {
        var chapter = await Chapter.findById(chapterId);
        return chapter.updateAttributes({ ChapterOrder : chapterOrder });
    }


    public async deleteChapter(chapterId: number) {
        try {
            var result = await Chapter.destroy({ where: { ChapterId: chapterId } });
            return result
        }
        catch (e) {
            return ({ error_message: "Không thể xóa chương này" })
        }
    }
}
