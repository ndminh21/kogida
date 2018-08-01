"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChapterService_1 = require("../../service/database/ChapterService");
const ExerciseService_1 = require("../../service/database/ExerciseService");
const Parse_1 = require("../../service/math/Parse");
const GrammarService_1 = require("../../service/grammar/GrammarService");
const SolutionService_1 = require("../../service/database/SolutionService");
const TexRender_1 = require("../../service/result/TexRender");
const TexGenerator_1 = require("../../service/result/TexGenerator");
const DiagramService_1 = require("../../service/math/DiagramService");
const ConsideringChangeService_1 = require("../../service/math/ConsideringChangeService");
const ExamService_1 = require("../../service/database/ExamService");
class APIController {
    static route(router) {
        let chapterSerive = new ChapterService_1.default();
        let exerciseService = new ExerciseService_1.default();
        let solutionService = new SolutionService_1.default();
        var elasticsearch = require('elasticsearch');
        var examService = new ExamService_1.default();
        router.post("/api/tim-kiem-chuong-theo-ma-phan-cong", async function (req, res) {
            var gradeSubjectId = req.body["gradeSubjectId"];
            var result = await chapterSerive.getByGradeSubjectId(gradeSubjectId);
            res.json(result);
        });
        router.get("/api/tim-kiem-bai-tap-theo-noi-dung", async function (req, res) {
            var content = req.query["content"];
            var ChapterId = req.query["chapterId"];
            var result = await exerciseService.searchExercise(content, ChapterId);
            res.json(result);
        });
        router.get("/api/xoa-bai-giai", async function (req, res) {
            var id = req.query["mabaigiai"];
            var result = await solutionService.delete(id);
            res.json(result);
        });
        router.get("/api/ve-bang-xet-dau", async function (req, res) {
            let values = req.query["values"];
            let signs = req.query["signs"];
            let variable = req.query["variable"];
            const result = {
                status: 200,
                base64: await TexRender_1.default.ToBase64(TexGenerator_1.default.GenerateConsideringSignTable(values, signs, variable))
            };
            res.json(result);
        });
        router.post("/api/ve-do-thi", async function (req, res) {
            var result = JSON.parse(req.body["result"]);
            var classification = req.body["classification"];
            var message = null;
            var diagram = await DiagramService_1.default.getBase64(result["diagramInput"], classification);
            message = {
                status: 200,
                base64: diagram.base64
            };
            res.json(message);
        });
        router.post("/api/ve-do-thi-bat-ky", async function (req, res) {
            var classification = "nosupport";
            var xminTex = req.body["xmin"];
            var xmaxTex = req.body["xmax"];
            var yminTex = req.body["ymin"];
            var ymaxTex = req.body["ymax"];
            var functionTex = req.body["functionTex"];
            var result = {};
            var functionTree = await GrammarService_1.default.getTreeFromLatex(functionTex);
            result.latexExpr = Parse_1.default.parseToLatexExpr(functionTree);
            result.functionSympy = Parse_1.default.parseToSymPyRad(functionTree);
            var message = null;
            if (result.latexExpr.indexOf("nosupport") < 0) {
                var xminTree = await GrammarService_1.default.getTreeFromLatex(xminTex);
                var xmaxTree = await GrammarService_1.default.getTreeFromLatex(xmaxTex);
                var yminTree = await GrammarService_1.default.getTreeFromLatex(yminTex);
                var ymaxTree = await GrammarService_1.default.getTreeFromLatex(ymaxTex);
                result.xmin = Parse_1.default.parseToSymPyRad(xminTree);
                result.xmax = Parse_1.default.parseToSymPyRad(xmaxTree);
                result.ymin = Parse_1.default.parseToSymPyRad(yminTree);
                result.ymax = Parse_1.default.parseToSymPyRad(ymaxTree);
                message = await DiagramService_1.default.getBase64(result, classification);
            }
            else
                message = {
                    status: 202,
                    message: "nosupport"
                };
            console.log(message);
            res.json(message);
        });
        router.get("/api/ve-bang-bien-thien", async function (req, res) {
            let functionTex = req.query["functionTex"];
            let xmin = req.query["xmin"];
            let xmax = req.query["xmax"];
            let open_left = req.query["open_left"];
            let open_right = req.query["open_right"];
            //functionTex = "\\power{x}{2}+x+1"
            //functionTex = "\\frac{\\plognepe{2}{x}}{x}"
            xmin = "-1";
            xmax = "1";
            var xminTree = await GrammarService_1.default.getTreeFromLatex(xmin);
            var xmaxTree = await GrammarService_1.default.getTreeFromLatex(xmax);
            var functionTree = await GrammarService_1.default.getTreeFromLatex(functionTex);
            var functionSympy = Parse_1.default.parseToSymPyRad(functionTree);
            var xminSympy = Parse_1.default.parseToSymPyRad(xminTree);
            var xmaxSympy = Parse_1.default.parseToSymPyRad(xmaxTree);
            var conditionStr = Parse_1.default.getConditions(functionTree);
            var result = null;
            if (conditionStr.indexOf("nosupport") >= 0) {
                result = {
                    message: "invalid"
                };
            }
            else {
                var conditions = conditionStr.split(";").filter(x => x != "");
                var conditionsLeq = conditions.filter(x => x.indexOf("Eq") < 0);
                var conditionsEq = conditions.filter(x => x.indexOf("Eq") >= 0);
                result = await ConsideringChangeService_1.default.getConsideringChange(functionSympy, conditionsLeq, conditionsEq, xmaxSympy, xminSympy, true, true);
                var tex = TexGenerator_1.default.GenerateConsideringChangeTable(result["considering_change"]);
                var base64 = await TexRender_1.default.ToBase64(tex);
            }
            result = {
                status: 200,
                base64: base64,
                consideringChange: result["considering_change"]
            };
            console.log(result);
            res.json(result);
        });
        router.get("/api/lay-cau-hoi", async function (req, res) {
            var madethi = req.query["ma"];
            var exam = await examService.getExamForTest(madethi);
            res.json({ length: exam.length, exam: exam });
        });
    }
}
exports.default = APIController;
