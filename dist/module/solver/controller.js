"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GradeService_1 = require("../../service/database/GradeService");
class SolverController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        router.get("/old/giai-pt-hpt", async function (req, res) {
            res.render("../module/solver/view", {
                gradeList: await gradeService.findAll()
            });
        });
    }
}
exports.default = SolverController;
