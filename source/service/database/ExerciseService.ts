import { Solution } from './../../model/Solution';
import { GradeSubject } from './../../model/GradeSubject';
import { Exercise } from './../../model/Exercise';
import { Chapter } from './../../model/Chapter';
import { Grade } from '../../model/Grade';
import { Subject } from '../../model/Subject';
import { User } from '../../model/User';

export default class ExerciseService {

    constructor() {
    }

    public async add(data : any) {
        return new Exercise(data).save();
    }

    public async update(ExerciseId, data){
        var ex = await Exercise.findOne({ where: { ExerciseId } });
        return ex.updateAttributes(data);
    }
    public async getSolutionByExerciseId(ExerciseId: number) {
        var ex = await Exercise.findOne({
            include: [Solution],
            where: { ExerciseId }
        });
        return ex.toJSON().SolutionList
    }

    public async getById(ExerciseId : number){
        return Exercise.findOne({
            include: [{
                model: Chapter,
                include: [
                    {
                        model: GradeSubject,
                        include: [
                            Grade, Subject
                        ]
                    },
                    
                ]
            }, {
                model: Solution,
                include: [
                    {
                        model: User,
                        as: "CreatedUser"
                    }
                ]
            }
        ],
            where: { ExerciseId}
        });
    }
    public async findAll() {
        return Exercise.findAll({
            include: [{
                model: Chapter,
                include: [
                    {
                        model: GradeSubject,
                        include: [
                            Grade, Subject
                        ]
                    },
                    
                ]
            },
            Solution
        ]
        });
    }
    
    public async delete(exerciseId: number) {
        return Exercise.destroy({ where: { ExerciseId : exerciseId } });
    }

    public async getByChapterId(chapterId : number){
        return Exercise.findAll({
            include: [{
                model: GradeSubject,
                include: [
                    Grade, Subject
                ]
                },
                Solution
            ],
            where : {
                ChapterId : chapterId
            },
            order : ['createdAt','DESC']
        });
    }

    public async searchExercise(content : string, ChapterId : number){
        var Fuse = require('fuse.js')
        var options = {
            //shouldSort: true,
            shouldSort: true,
            tokenize: true,
            threshold: 0.6,
            includeScore: true,
            keys: ['Content']
        }
        if(ChapterId != undefined){
            var allEx = await Exercise.findAll({
                include: [
                    {
                        model : User,
                        as: "CreatedUser"
                    },
                    {
                        model: User,
                        as: "UpdatedUser"
                    },
                    {
                        model: Chapter,
                        include: [
                            {
                                model : GradeSubject,
                                include : [
                                    Grade,
                                    Subject
                                ]
                            }
                        ]
                    }, Solution
                ],
                where: { ChapterId }
            });
        }
        else
            var allEx = await Exercise.findAll({
                include: [
                    {
                        model: User,
                        as: "CreatedUser"
                    },
                    {
                        model: User,
                        as: "UpdatedUser"
                    },
                    {
                        model: Chapter,
                        include: [
                            {
                                model: GradeSubject,
                                include: [
                                    Grade,
                                    Subject
                                ]
                            }
                        ]
                    },
                    Solution
                ],

            });

        var fuse = new Fuse(allEx, options)
            
        
        var result = fuse.search(content)
        result = result.map(x => x.item)
        
        return result
    }   

    public async togglePublised(exerciseId) {
        var exercise = await Exercise.findById(exerciseId);
        var IsPublished = !exercise.toJSON().IsPublished
        return exercise.updateAttributes({ IsPublished  });
    }

    
}
