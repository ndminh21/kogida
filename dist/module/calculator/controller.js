"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CalculatorService_1 = require("../../service/math/CalculatorService");
const PolynomialService_1 = require("../../service/math/PolynomialService");
const PolymialInequationService_1 = require("../../service/math/PolymialInequationService");
const GradeService_1 = require("../../service/database/GradeService");
const Tree_1 = require("../../service/math/Tree");
const Parse_1 = require("../../service/math/Parse");
const GrammarService_1 = require("../../service/grammar/GrammarService");
class CalculatorController {
    static route(router) {
        var gradeService = new GradeService_1.default();
        router.get("/may-tinh-kogida", async function (req, res) {
            res.render("../module/calculator/view", {
                editor: req.query.editor != undefined ? (req.query.editor === "true") : false,
                solver: req.query.solver != undefined ? (req.query.solver === "true") : false
            });
        });
        router.get("/may-tinh-truc-tiep-kogida", async function (req, res) {
            res.render("../module/calculator/direct", {
                gradeList: await gradeService.findAll(),
                editor: req.query.editor != undefined ? (req.query.editor === "true") : false,
                solver: req.query.solver != undefined ? (req.query.solver === "true") : false
            });
        });
        router.post("/tinh-toan", async function (req, res) {
            var data = req.body;
            var tree = await GrammarService_1.default.getTreeFromLatex(data.latexString);
            var Tree = new Tree_1.default(tree);
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index).map(x => x.trim().replace("\\", "").replace("subscript{", "").replace("}{", "_").replace("}", ""));
            let inequation = ["LtEq", "GtEq", "LeqEq", "GeqEq"];
            if (data.variables)
                data.variables = data.variables.map(x => x.trim().replace("\\", ""));
            if (Tree.getRootOperation() == "EqSys") {
                let isLinear = tree.children.map(x => Parse_1.default.checkIsLinear(x)).filter(y => y === false);
                var result = await PolynomialService_1.default.solveSystem(tree, variablesJSON, data.variables, data.angleMode, data.numberMode);
                res.send(result);
            }
            else if (Tree.getRootOperation() == "Eq") {
                var result = await PolynomialService_1.default.solveSimply(tree, variablesJSON, data.variables, data.angleMode, data.numberMode);
                res.send(result);
            }
            else if (inequation.indexOf(Tree.getRootOperation()) != -1) {
                var result = await PolymialInequationService_1.default.solveSimply(tree, variablesJSON, data.variables);
                res.send(result);
            }
            else {
                if (data.variables) {
                    data.variables = data.variables.map(x => x.trim().replace("\\", "").replace("subscript{", "").replace("}{", "_").replace("}", ""));
                }
                if (data.angleMode === "deg")
                    var sympyStr = Parse_1.default.parseToSymPyDegree(tree);
                else
                    var sympyStr = Parse_1.default.parseToSymPyRad(tree);
                var result = await CalculatorService_1.default.calculator(sympyStr, variablesJSON);
                res.send(result);
            }
        });
    }
}
exports.default = CalculatorController;
