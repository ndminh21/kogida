"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GradeService_1 = require("../../service/database/GradeService");
const GrammarService_1 = require("../../service/grammar/GrammarService");
const Tree_1 = require("../../service/math/Tree");
const FunctionExplorerService_1 = require("../../service/math/FunctionExplorerService");
const TexGenerator_1 = require("../../service/result/TexGenerator");
const TexRender_1 = require("../../service/result/TexRender");
class FunctionExplorerController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        router.get("/khao-sat-ham-so", async function (req, res) {
            res.render("../module/function-explorer/view", {
                gradeList: await gradeService.findAll(),
                functionTex: null,
                result: null
            });
        });
        router.get("/bai-giai-khao-sat", async function (req, res) {
            var latexString = req.query.tex;
            var jsonTree = await GrammarService_1.default.getTreeFromLatex(latexString);
            var Tree = new Tree_1.default(jsonTree);
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index);
            let result = null;
            result = await FunctionExplorerService_1.default.FunctionExplorer(jsonTree, variablesJSON);
            res.render("../module/function-explorer/view", {
                gradeList: await gradeService.findAll(),
                functionTex: req.query["tex"],
                classification: result["classification"],
                result: result["result"]
            });
        });
        router.post("/api/ve-bang-bien-thien-cua-cac-ham-so-ho-tro", async function (req, res) {
            var result = JSON.parse(req.body["result"]);
            var classfication = req.body["classification"];
            var message = null;
            if (classfication === "linearfunction") {
                let positive = result["a"]["sign"] === "pos";
                message = {
                    status: 200,
                    base64: await TexRender_1.default.ToBase64(TexGenerator_1.default.GenerateConsideringChangeTableForLinerFunction(positive))
                };
            }
            else if (classfication === "quadraticfunction") {
                let positive = result["a"]["sign"] === "pos";
                message = {
                    status: 200,
                    base64: await TexRender_1.default.ToBase64(TexGenerator_1.default.GenerateConsideringChangeTableForQuadraticFunction(positive, result["I"]))
                };
            }
            else if (classfication === "cubicfunction") {
                message = {
                    status: 200,
                    base64: await TexRender_1.default.ToBase64(TexGenerator_1.default.GenerateConsideringChangeTableForCubicFunction(result["considering_change"], result["deri"]["root"], result["val"]))
                };
            }
            else if (classfication === "biquadraticfunction") {
                message = {
                    status: 200,
                    base64: await TexRender_1.default.ToBase64(TexGenerator_1.default.GenerateConsideringChangeTableForBiquadraticFunction(result["considering_change"], result["deri"]["root"], result["val"]))
                };
            }
            else if (classfication === "linearrationalfunction") {
                message = {
                    status: 200,
                    base64: await TexRender_1.default.ToBase64(TexGenerator_1.default.GenerateConsideringChangeTableForLinearRationalFunction(result["considering_change"], result["deri"]["root"], result["val"]))
                };
            }
            else if (classfication === "quadraticandlinearrationalfunction") {
                message = {
                    status: 200,
                    base64: await TexRender_1.default.ToBase64(TexGenerator_1.default.GenerateConsideringChangeTableForQuadraticAndLinearRationalFunction(result["considering_change"], result["deri"]["root"], result["val"]))
                };
            }
            res.json(message);
        });
    }
}
exports.default = FunctionExplorerController;
