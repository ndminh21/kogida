"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("./../authentication/authentication");
const GradeService_1 = require("../../service/database/GradeService");
const SubjectService_1 = require("../../service/database/SubjectService");
const ChapterService_1 = require("../../service/database/ChapterService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
const SolutionService_1 = require("../../service/math/SolutionService");
const Parse_1 = require("../../service/math/Parse");
const GrammarService_1 = require("../../service/grammar/GrammarService");
class ExerciseViewInDetailsController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        let subjectService = new SubjectService_1.default();
        let chapterService = new ChapterService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let authentication = new authentication_1.Authentication();
        router.get("/xem-chi-tiet-bai-tap/:exerciseid", async function (req, res) {
            const exerciseId = req.params["exerciseid"];
            const page = req.params["page"];
            res.render("../module/exercise-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                exercise: await exerciseService.getById(exerciseId)
            });
        });
        router.get("/giai-bai-tap-theo-tham-so", async function (req, res) {
            const exerciseId = req.query["mabaitap"];
            const values = JSON.parse(req.query["thamso"]);
            const exercise = await exerciseService.getById(exerciseId);
            if (exercise.SolutionList.length <= 0) {
                res.render("../module/exercise-view-in-details/view", {
                    gradeList: await gradeService.findAll(),
                    exercise: exercise,
                    parameterValues: values,
                    show: true
                });
                return false;
            }
            var sympyList = await SolutionService_1.default.getSympyAndVariable(exercise.toJSON().SolutionList);
            const arrKeyTex = JSON.parse(exercise.toJSON().Parameter);
            sympyList.KeyArr = [];
            for (var i = 0; i < values.length; i++) {
                if (arrKeyTex[i].tex.indexOf("subscript") < 0) {
                    var keyTree = await GrammarService_1.default.getTreeFromLatex(arrKeyTex[i].tex);
                    sympyList.KeyArr.push(Parse_1.default.parseToSymPyRad(keyTree));
                }
                else {
                    let index = sympyList.texList.findIndex(x => x.tex == arrKeyTex[i].tex);
                    sympyList.KeyArr.push(sympyList.texList[index].variables);
                }
                var valueTree = await GrammarService_1.default.getTreeFromLatex(values[i]);
                sympyList.ValueArr.push(Parse_1.default.parseToSymPyRad(valueTree));
            }
            let result = null;
            result = await SolutionService_1.default.Solve(sympyList);
            const cheerio = require('cheerio');
            var solutionList = exercise.toJSON().SolutionList;
            for (var i = 0; i < solutionList.length; i++) {
                var solution = solutionList[i];
                const $ = cheerio.load(solution.Content, { xmlMode: true });
                for (var j = 0; j < $('span').length; j++) {
                    var formularIndex = parseInt($('span').eq(j).attr('formula'));
                    switch ($('span').eq(j).attr('format')) {
                        case "1":
                            $('span').eq(j).html('\\(' + result[i][formularIndex].format1 + '\\)');
                            break;
                        case "2":
                            $('span').eq(j).html('\\(' + result[i][formularIndex].format2 + '\\)');
                            break;
                        case "3":
                            $('span').eq(j).html('\\(' + result[i][formularIndex].format3 + '\\)');
                            break;
                        case "4":
                            $('span').eq(j).html('\\(' + result[i][formularIndex].format4 + '\\)');
                            break;
                    }
                }
                var exReturn = exercise.toJSON();
                exReturn.SolutionList[i].Content = $.html();
            }
            res.render("../module/exercise-view-in-details/view", {
                gradeList: await gradeService.findAll(),
                exercise: exReturn,
                parameterValues: values,
                show: true
            });
        });
    }
}
exports.default = ExerciseViewInDetailsController;
