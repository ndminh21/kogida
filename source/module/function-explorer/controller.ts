import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import SubjectService from '../../service/database/SubjectService';
import ChapterService from '../../service/database/ChapterService';
import ExerciseService from '../../service/database/ExerciseService';
import { Chapter } from '../../model/Chapter';
import GrammarService  from '../../service/grammar/GrammarService'
import KogidaTree from '../../service/math/Tree'
import FunctionExplorerService from '../../service/math/FunctionExplorerService'
import TexGenerator from '../../service/result/TexGenerator';
import TexRender from '../../service/result/TexRender';
import DiagramService from "../../service/math/DiagramService";
import FindMinMaxService from '../../service/math/FindMinMaxService'
export default class FunctionExplorerController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();

        router.get("/khao-sat-ham-so", async function (req: Request, res: Response) {
            
            res.render("../module/function-explorer/view", {
                gradeList: await gradeService.findAll(),
                functionTex: null,
                result: null
            });
        });

        router.get("/bai-giai-khao-sat", async function (req: Request, res: Response) {
            var latexString = req.query.tex;
            var jsonTree = await GrammarService.getTreeFromLatex(latexString);
            var Tree = new KogidaTree(jsonTree);
            let variablesJSON = Tree.findOutVariables().map(x => x.value).filter((value, index, array) => array.indexOf(value) == index);
            let result: Object = null
                
            result = await FunctionExplorerService.FunctionExplorer(jsonTree, variablesJSON);
            
            res.render("../module/function-explorer/view", {
                gradeList: await gradeService.findAll(),
                functionTex: req.query["tex"],
                classification: result["classification"],
                result: result["result"]
            });
        });

        router.post("/api/ve-bang-bien-thien-cua-cac-ham-so-ho-tro", async function(req: Request, res: Response) {
            var result = JSON.parse(req.body["result"]);
            var classfication = req.body["classification"];
            var message : Object = null;

            if (classfication === "linearfunction") {
                let positive = result["a"]["sign"] === "pos";
                message = {
                    status: 200,
                    base64: await TexRender.ToBase64(TexGenerator.GenerateConsideringChangeTableForLinerFunction(positive))
                }                    
            }
            else if (classfication === "quadraticfunction") {
                let positive = result["a"]["sign"] === "pos";
                message = {
                    status: 200,
                    base64: await TexRender.ToBase64(TexGenerator.GenerateConsideringChangeTableForQuadraticFunction(positive, <Object> result["I"]))
                }                                    
            }
            else if (classfication === "cubicfunction") {
                message = {
                    status: 200,
                    base64: await TexRender.ToBase64(TexGenerator.GenerateConsideringChangeTableForCubicFunction(result["considering_change"], result["deri"]["root"], result["val"]))
                }
            }
            else if (classfication === "biquadraticfunction"){
                message = {
                    status: 200,
                    base64: await TexRender.ToBase64(TexGenerator.GenerateConsideringChangeTableForBiquadraticFunction(result["considering_change"], result["deri"]["root"], result["val"]))
                }
            }
            else if (classfication === "linearrationalfunction") {
                message = {
                    status: 200,
                    base64: await TexRender.ToBase64(TexGenerator.GenerateConsideringChangeTableForLinearRationalFunction(result["considering_change"], result["deri"]["root"], result["val"]))
                }
            }
            else if (classfication === "quadraticandlinearrationalfunction") {
                message = {
                    status: 200,
                    base64: await TexRender.ToBase64(TexGenerator.GenerateConsideringChangeTableForQuadraticAndLinearRationalFunction(result["considering_change"], result["deri"]["root"], result["val"]))
                }
            }

            res.json(message);
        })  
    }
}
