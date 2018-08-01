"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Solution_1 = require("./../../model/Solution");
const GradeSubject_1 = require("./../../model/GradeSubject");
const Exercise_1 = require("./../../model/Exercise");
const Chapter_1 = require("./../../model/Chapter");
const Grade_1 = require("../../model/Grade");
const Subject_1 = require("../../model/Subject");
const User_1 = require("../../model/User");
class ExerciseService {
    constructor() {
    }
    async add(data) {
        return new Exercise_1.Exercise(data).save();
    }
    async update(ExerciseId, data) {
        var ex = await Exercise_1.Exercise.findOne({ where: { ExerciseId } });
        return ex.updateAttributes(data);
    }
    async getSolutionByExerciseId(ExerciseId) {
        var ex = await Exercise_1.Exercise.findOne({
            include: [Solution_1.Solution],
            where: { ExerciseId }
        });
        return ex.toJSON().SolutionList;
    }
    async getById(ExerciseId) {
        return Exercise_1.Exercise.findOne({
            include: [{
                    model: Chapter_1.Chapter,
                    include: [
                        {
                            model: GradeSubject_1.GradeSubject,
                            include: [
                                Grade_1.Grade, Subject_1.Subject
                            ]
                        },
                    ]
                }, {
                    model: Solution_1.Solution,
                    include: [
                        {
                            model: User_1.User,
                            as: "CreatedUser"
                        }
                    ]
                }
            ],
            where: { ExerciseId }
        });
    }
    async findAll() {
        return Exercise_1.Exercise.findAll({
            include: [{
                    model: Chapter_1.Chapter,
                    include: [
                        {
                            model: GradeSubject_1.GradeSubject,
                            include: [
                                Grade_1.Grade, Subject_1.Subject
                            ]
                        },
                    ]
                },
                Solution_1.Solution
            ]
        });
    }
    async delete(exerciseId) {
        return Exercise_1.Exercise.destroy({ where: { ExerciseId: exerciseId } });
    }
    async getByChapterId(chapterId) {
        return Exercise_1.Exercise.findAll({
            include: [{
                    model: GradeSubject_1.GradeSubject,
                    include: [
                        Grade_1.Grade, Subject_1.Subject
                    ]
                },
                Solution_1.Solution
            ],
            where: {
                ChapterId: chapterId
            },
            order: ['createdAt', 'DESC']
        });
    }
    async searchExercise(content, ChapterId) {
        var Fuse = require('fuse.js');
        var options = {
            //shouldSort: true,
            shouldSort: true,
            tokenize: true,
            threshold: 0.6,
            includeScore: true,
            keys: ['Content']
        };
        if (ChapterId != undefined) {
            var allEx = await Exercise_1.Exercise.findAll({
                include: [
                    {
                        model: User_1.User,
                        as: "CreatedUser"
                    },
                    {
                        model: User_1.User,
                        as: "UpdatedUser"
                    },
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
                        ]
                    }, Solution_1.Solution
                ],
                where: { ChapterId }
            });
        }
        else
            var allEx = await Exercise_1.Exercise.findAll({
                include: [
                    {
                        model: User_1.User,
                        as: "CreatedUser"
                    },
                    {
                        model: User_1.User,
                        as: "UpdatedUser"
                    },
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
                        ]
                    },
                    Solution_1.Solution
                ],
            });
        var fuse = new Fuse(allEx, options);
        var result = fuse.search(content);
        result = result.map(x => x.item);
        return result;
    }
    async togglePublised(exerciseId) {
        var exercise = await Exercise_1.Exercise.findById(exerciseId);
        var IsPublished = !exercise.toJSON().IsPublished;
        return exercise.updateAttributes({ IsPublished });
    }
}
exports.default = ExerciseService;
