"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TexRender_1 = require("../../service/result/TexRender");
const PolynomialService_1 = require("../../service/math/PolynomialService");
const PolymialInequationService_1 = require("../../service/math/PolymialInequationService");
const Tree_1 = require("../../service/math/Tree");
const GrammarService_1 = require("../../service/grammar/GrammarService");
const GradeService_1 = require("../../service/database/GradeService");
class SolutionController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        router.get("/bai-giai-pt-hpt", async function (req, res) {
            var latexString = req.query.tex;
            var variables = req.query.variables;
            var angleMode = req.query.anglemode;
            var jsonTree = await GrammarService_1.default.getTreeFromLatex(latexString);
            var Tree = new Tree_1.default(jsonTree);
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index);
            var jsonVariables = JSON.parse(variables);
            var input = "";
            let inequation = ["LtEq", "GtEq", "LeqEq", "GeqEq"];
            let result_SBS = null;
            let resultToDisplay;
            let rootSetToDisplay = null;
            let neccessaryToClear = false;
            let variable = null;
            if (Tree.getRootOperation() == "Eq") {
                result_SBS = await PolynomialService_1.default.solveSimplySBS(jsonTree, variablesJSON, variables, angleMode);
                input = "eq";
                resultToDisplay = await TexRender_1.default.fromEquationSBSResultToTex(result_SBS, null);
            }
            else if (inequation.indexOf(Tree.getRootOperation()) != -1) {
                result_SBS = await PolymialInequationService_1.default.solveSimplySBS(jsonTree, variablesJSON, variables);
                input = "ineq";
                variable = variablesJSON[0];
                resultToDisplay = await TexRender_1.default.fromEquationSBSResultToTex(result_SBS["step"], variable);
                rootSetToDisplay = TexRender_1.default.FromSet(result_SBS["result"]["rootset"]);
                if (result_SBS["result"]["rootset"].hasOwnProperty("unions") || result_SBS["result"]["rootset"].hasOwnProperty("intersections"))
                    neccessaryToClear = true;
            }
            else if (Tree.getRootOperation() == "EqSys") {
                result_SBS = await PolynomialService_1.default.solveSystemSBS(jsonTree, variablesJSON, jsonVariables);
                input = "eqsys";
                resultToDisplay = TexRender_1.default.fromEqSysSBSResultToTex(result_SBS["root"], jsonVariables);
            }
            console.log(resultToDisplay);
            res.render("../module/solution/view", {
                gradeList: await gradeService.findAll(),
                result: resultToDisplay,
                rootset: rootSetToDisplay,
                input: input,
                neccessaryToClear: neccessaryToClear,
                variable: variable,
                tex: req.query.tex
            });
        });
    }
}
exports.default = SolutionController;
