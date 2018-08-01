"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GradeService_1 = require("../../service/database/GradeService");
const GrammarService_1 = require("../../service/grammar/GrammarService");
const FunctionExplorerService_1 = require("../../service/math/FunctionExplorerService");
const Parse_1 = require("../../service/math/Parse");
class FunctionDrawController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        router.get("/hinh-ve-do-thi-bat-ki", async function (req, res) {
            var functionTex = req.query["tex"];
            var xmin = req.query["xmin"];
            var ymin = req.query["ymin"];
            var xmax = req.query["xmax"];
            var ymax = req.query["ymax"];
            var functionTree = await GrammarService_1.default.getTreeFromLatex(functionTex);
            var functionExpr = Parse_1.default.parseToLatexExpr(functionTree);
            var message = null;
            if (functionExpr.indexOf("nosupport") < 0) {
                var data = {
                    xminTree: await GrammarService_1.default.getTreeFromLatex(xmin),
                    xmaxTree: await GrammarService_1.default.getTreeFromLatex(xmax),
                    yminTree: await GrammarService_1.default.getTreeFromLatex(ymin),
                    ymaxTree: await GrammarService_1.default.getTreeFromLatex(ymax)
                };
                var result = await FunctionExplorerService_1.default.FunctionExplorerAny(data);
                var message = result.message; // if xmin > xmax or ymin > ymax: message = "invalidrange" otherwise message = "valid"    
            }
            else
                message = "nosupport";
            res.render("../module/function-draw/view", {
                gradeList: await gradeService.findAll(),
                functionTex: functionTex,
                xmin: xmin,
                ymin: ymin,
                xmax: xmax,
                ymax: ymax,
                message: message
            });
        });
        router.get("/ve-do-thi-ham-so-bat-ki", async function (req, res) {
            var xmin = "-10";
            var ymin = "-10";
            var xmax = "10";
            var ymax = "10";
            res.render("../module/function-draw/view", {
                gradeList: await gradeService.findAll(),
                functionTex: null,
                xmin: xmin,
                ymin: ymin,
                xmax: xmax,
                ymax: ymax
            });
        });
    }
}
exports.default = FunctionDrawController;
