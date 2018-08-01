"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GradeService_1 = require("../../service/database/GradeService");
const GrammarService_1 = require("../../service/grammar/GrammarService");
const Parse_1 = require("../../service/math/Parse");
const FindMinMaxService_1 = require("../../service/math/FindMinMaxService");
class FunctionExplorerController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        router.get("/tim-gtln-gtnn-tren-doan", async function (req, res) {
            res.render("../module/minmax/view", {
                gradeList: await gradeService.findAll(),
                functionTex: null,
                xmin: "-1",
                xmax: "1",
                set: "closed",
                result: null
            });
        });
        router.get("/tim-gtln-gtnn-tren-khoang", async function (req, res) {
            res.render("../module/minmax/view", {
                gradeList: await gradeService.findAll(),
                functionTex: null,
                xmin: "-1",
                xmax: "1",
                set: "open",
                result: null
            });
        });
        router.get("/giai-tim-gtln-gtnn-tren-doan", async function (req, res) {
            var functionTex = req.query["tex"];
            var xmin = req.query["xmin"];
            var xmax = req.query["xmax"];
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
                result = await FindMinMaxService_1.default.findMinMax(functionSympy, conditionsLeq, conditionsEq, xminSympy, xmaxSympy);
            }
            console.log(result);
            res.render("../module/minmax/view", {
                gradeList: await gradeService.findAll(),
                functionTex: functionTex,
                xmin: xmin,
                xmax: xmax,
                set: "closed",
                result: result
            });
        });
        router.get("/giai-tim-gtln-gtnn-tren-khoang", async function (req, res) {
            var functionTex = req.query["tex"];
            var xmin = req.query["xmin"];
            var xmax = req.query["xmax"];
            var option = req.query["option"]; //left, right, full
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
                result = await FindMinMaxService_1.default.findMinMaxOpenSet(functionSympy, conditionsLeq, conditionsEq, xminSympy, xmaxSympy, option);
            }
            console.log(result);
            res.render("../module/minmax/view", {
                gradeList: await gradeService.findAll(),
                functionTex: functionTex,
                xmin: xmin,
                xmax: xmax,
                set: "open",
                result: result
            });
        });
    }
}
exports.default = FunctionExplorerController;
