"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GradeService_1 = require("../../service/database/GradeService");
class FunctionController {
    static route(router) {
        let gradeService = new GradeService_1.default();
        router.get("/", async function (req, res) {
            res.render("../module/home/view", {
                gradeList: await gradeService.findAll()
            });
        });
    }
}
exports.default = FunctionController;
