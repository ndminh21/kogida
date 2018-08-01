"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GradeService_1 = require("../../service/database/GradeService");
const TexRender_1 = require("../../service/result/TexRender");
const PolynomialService_1 = require("../../service/math/PolynomialService");
const PolymialInequationService_1 = require("../../service/math/PolymialInequationService");
const Tree_1 = require("../../service/math/Tree");
const GrammarService_1 = require("../../service/grammar/GrammarService");
class SolverEquationController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        router.get("/giai-pt-hpt", async function (req, res) {
            res.render("../module/solver-equation/view", {
                gradeList: await gradeService.findAll(),
                tex: null,
                angleMode: null,
                variables: null,
                result: null
            });
        });
        router.get("/cach-giai-pt-hpt", async function (req, res) {
            const tex = req.query["tex"];
            const angleMode = req.query["anglemode"];
            const variables = JSON.parse(decodeURIComponent(req.query["variables"]));
            var jsonTree = await GrammarService_1.default.getTreeFromLatex(tex);
            var Tree = new Tree_1.default(jsonTree);
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index);
            let inequation = ["LtEq", "GtEq", "LeqEq", "GeqEq"];
            let result_SBS = null;
            if (Tree.getRootOperation() == "Eq") {
                result_SBS = await PolynomialService_1.default.solveSimplySBS(jsonTree, variablesJSON, variables, angleMode);
            }
            else if (inequation.indexOf(Tree.getRootOperation()) != -1) {
                result_SBS = await PolymialInequationService_1.default.solveSimplySBS(jsonTree, variablesJSON, variables);
            }
            else if (Tree.getRootOperation() == "EqSys") {
                let rawResult = await PolynomialService_1.default.solveSystemSBS(jsonTree, variablesJSON, variables);
                result_SBS = new Object();
                if (rawResult["classification"] == "lineareqsys") {
                    result_SBS["category"] = "eqsys";
                    result_SBS["classification"] = "lineareqsys";
                    result_SBS["step"] = TexRender_1.default.fromEqSysSBSResultToTex(rawResult["root"], variables);
                    result_SBS["root"] = [rawResult["root"][rawResult["root"].length - 1]["and"].map((x) => x[x.length - 1])];
                }
                else {
                    result_SBS = rawResult;
                }
            }
            else {
                result_SBS = new Object();
                result_SBS["category"] = "invalid";
            }
            res.render("../module/solver-equation/view", {
                gradeList: await gradeService.findAll(),
                tex: tex,
                angleMode: angleMode,
                variables: decodeURIComponent(req.query["variables"]),
                result: result_SBS // Result for response      
            });
        });
    }
}
exports.default = SolverEquationController;
