import { Exercise } from './../../model/Exercise';
import { Solution } from './../../model/Solution';
import { Authentication } from './../authentication/authentication';
import { Response, Request, Router } from 'express';
import GradeSubjectService from '../../service/database/GradeSubjectService';
import ExerciseService from '../../service/database/ExerciseService';
import SolutionService from '../../service/database/SolutionService'
export default class AdminExerciseSolutionController {
    public static route(router: Router): void {
        let authentication = new Authentication
        let gradeSubjectService : GradeSubjectService = new GradeSubjectService();
        let exerciseService : ExerciseService = new ExerciseService();
        let solutionService: SolutionService = new SolutionService();

        router.get("/them-bai-giai", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            const exerciseId: number = req.query["mabaitap"];
                        
            res.render("../module/admin-exercise-solution/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                exerciseInfo: await exerciseService.getById(exerciseId)
            });
        });

        router.get("/sua-bai-giai", authentication.isAuthenticated, authentication.canAccess, 
        async function (req: Request, res: Response) {
            const solutionId: number = req.query["mabaigiai"];
            const solution: Solution = <Solution> await solutionService.getById(solutionId);
            const exerciseInfo: Exercise = <Exercise> await exerciseService.getById(solution.Exercise.ExerciseId);
            
            res.render("../module/admin-exercise-solution/view", {
                userInfo: req.user,
                gradeSubjectList: await gradeSubjectService.findAll(),
                solution: solution,
                exerciseInfo: exerciseInfo
            });
        });

        router.get("/luu-bai-giai", authentication.isAuthenticated, authentication.canAccess,
        async function (req: Request, res: Response) {
            var solution :any = {}
            solution.ExerciseId = req.query["mabaitap"];
            solution.Content = req.query["noidung"];
            solution.Formula = req.query["congthuc"]
            if(!solution.Formula)
                solution.Formula = "[]"    
            solution.CreatedBy = req.user.UserId;
            solution.UpdatedBy = req.user.UserId;
            solution.IsPublished = true;
            var newSolution = await solutionService.add(solution)
            res.redirect("/them-bai-giai?mabaitap=" + solution.ExerciseId);
        });

        router.get("/luu-sua-bai-giai", authentication.isAuthenticated, authentication.canAccess,
        async function (req: Request, res: Response) {
            var solution :any = {}
            var SolutionId = req.query["mabaigiai"];
            solution.ExerciseId = req.query["mabaitap"];
            solution.Content = req.query["noidung"];
            solution.Formula = req.query["congthuc"]
            if(!solution.Formula)
                solution.Formula = "[]"    
            solution.UpdatedBy = req.user.UserId;
            solution.IsPublished = true;
            var updateSolution = await solutionService.update(SolutionId,solution)
            res.redirect("/quan-ly-bai-giai?mabaitap="+solution.ExerciseId);
        });
    }
}
