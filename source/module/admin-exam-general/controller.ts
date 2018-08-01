import { GradeSubject } from './../../model/GradeSubject';
import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import SubjectService from '../../service/database/SubjectService'
import GradeService from '../../service/database/GradeService'
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ChapterService from '../../service/database/ChapterService';
import UnitService from '../../service/database/UnitService'
import { Exercise } from '../../model/Exercise';
import ExerciseService from '../../service/database/ExerciseService'
import ExamService from '../../service/database/ExamService'
import * as moment from "moment"
import { Exam } from '../../model/Exam';

export default class AdminExamGeneralController {

    public static route(router: Router): void {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let gradeSubjectService: GradeSubjectService = new GradeSubjectService();
        let chapterService: ChapterService = new ChapterService();
        let authentication = new Authentication();
        let unitService = new UnitService();
        let exerciseService = new ExerciseService();
        let examService = new ExamService();

        router.get("/admin/tao-thi-thu/buoc-1", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            var exerciseId = req.query["mabaitap"];

            res.render("../module/admin-exam-general/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                step: 1
            });
        });

        router.get("/admin/tao-thi-thu/buoc-2", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            var examId = req.query["makythi"];

            res.render("../module/admin-exam-general/view", {
                userInfo: req.user,
                exam: await examService.getById(examId),
                step: 2
            })
        });

        router.get("/admin/luu-thi-thu/buoc-1", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            var ExamName = req.query["ExamName"]; //save
            var Time = req.query["Time"]; //save
            var GradeSubjectId = req.query["GradeSubjectId"] == "-1" ? null : req.query["GradeSubjectId"]; //save
            var QuestionNumber = req.query["QuestionNumber"]; //save

            var Deadline = req.query["Deadline"]; // save
            var Secret = req.query["Secret"];
            var UseDeadline = req.query["UseDeadline"];
            var UseSecret = req.query["UseSecret"];

            
            if (UseDeadline === "yes")
            {
                Deadline = moment(Deadline, "DD/MM/YYYY HH:mm")
            }
            else Deadline = null;
            if (UseSecret === "yes")
            {
                var examSecret = await examService.getExamBySecrett(Secret)
                if (examSecret){
                    res.render("../module/admin-exam-general/view", {
                        userInfo: req.user,
                        gradeSubjectList: await gradeSubjectService.findAll(),
                        step: 1,
                        message: "failed_secret"
                    });
                    return false;
                }
            }
            else Deadline = null;

            var QuestionNumberInput = req.query["QuestionNumberInput"];
            var QuestionLabel = req.query["QuestionLabel"];
            var QuestionNumberWithLabel = req.query["QuestionNumberWithLabel"];
            
            var Structure = null; //save

            if (Array.isArray(QuestionLabel))
            {
                var QuestionWithLabelAndNumberList = QuestionLabel.map((label, index) => new Object({ label: label, number: Number(QuestionNumberWithLabel[index])}));
                Structure = JSON.stringify({
                    QuestionNumber: QuestionNumber,
                    QuestionNumberInput: QuestionNumberInput,
                    QuestionWithLabelAndNumberList: QuestionWithLabelAndNumberList
                });
            }
            else {
                if (QuestionLabel != null)
                    Structure = JSON.stringify({
                        QuestionNumber: QuestionNumber,
                        QuestionNumberInput: QuestionNumberInput,
                        QuestionWithLabelAndNumberList: [{label: QuestionLabel, number: Number(QuestionNumberWithLabel)}]
                    });
                else
                Structure = JSON.stringify({
                    QuestionNumber: QuestionNumber,
                    QuestionNumberInput: QuestionNumberInput,
                    QuestionWithLabelAndNumberList: []
                });
            }
            var exam : any = {}
            exam.ExamName = ExamName;
            exam.Time = Time;
            exam.GradeSubjectId = GradeSubjectId;
            exam.Deadline = Deadline;
            exam.Secret = Secret;
            exam.Structure = Structure;
            exam.CreatedBy = req.user.UserId;
            exam.UpdatedBy = req.user.UserId;
            exam.IsPublished = false;
            var newExam = await examService.add(exam)
            
            res.redirect("/admin/tao-thi-thu/buoc-2?makythi=" + newExam.toJSON().ExamId);
        });

        router.post("/admin/luu-thi-thu/buoc-2", authentication.isAuthenticated, authentication.canAccess,
        async function(req: Request, res: Response) {
            var ExamId = req.body["ExamId"];
            var Exam: Exam = <Exam> await examService.getById(ExamId);
            var QuestionList = []; //save

            for (let i = 0; i < JSON.parse(Exam.Structure)["QuestionNumberInput"]; i++) {
                var content = req.body["content_" + i];
                var isSolution = req.body["issolution_" + i];
                
                var solutionList: Array<String> = <Array<String>> req.body["solutiontext_" + i];
                var imageList: Array<String> = <Array<String>> req.body["imglink_" + i];
                QuestionList.push({
                    QuestionId: i,
                    Content: content,
                    Label: req.body["label_" + i],
                    AllowRandom: req.body["allowrandom_" + i] != null,
                    SolutionList: solutionList.map((value, index) => new Object({ text: value, solution: isSolution == index, id: index })),
                    MaxSolutionInRow: req.body["maxsolutioninrow_" + i],
                    ImageList: imageList.filter((link) => link.trim() != ""),
                    MaxImageInRow: req.body["maximginrow_" + i]
                })
            }
        
            var updateExam = await examService.update(ExamId, {QuestionList : JSON.stringify(QuestionList)})

            res.redirect("/admin/de-thi-thu-cua-toi");
        });

        
    }
}
