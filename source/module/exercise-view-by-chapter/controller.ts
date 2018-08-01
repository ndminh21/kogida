import { Authentication } from './../authentication/authentication';
import { Router, Request, Response } from 'express';
import GradeService from "../../service/database/GradeService"
import SubjectService from '../../service/database/SubjectService';
import ChapterService from '../../service/database/ChapterService';
import ExerciseService from '../../service/database/ExerciseService';
import { Chapter } from '../../model/Chapter';
import { Exercise } from '../../model/Exercise';

export default class ExerciseViewByChapterController {
    public static route(router: Router) {
        let gradeService: GradeService = new GradeService();
        let subjectService: SubjectService = new SubjectService();
        let chapterService: ChapterService = new ChapterService();
        let exerciseService: ExerciseService = new ExerciseService();
        let authentication = new  Authentication();

        router.get("/xem-bai-tap-theo-chuong/:chapterid/:chaptername/trang-:page", async function (req: Request, res: Response) {
            const chapterId: number = req.params["chapterid"];
            const page: number = req.params["page"];

            const chapter: Chapter = <Chapter> await chapterService.getById(chapterId);
            
            res.render("../module/exercise-view-by-chapter/view", {
                gradeList: await gradeService.findAll(),
                chapter: chapter,
                ExerciseList: chapter.ExerciseList,
                page: page
            });
        });

        router.get("/xem-bai-tap-theo-chuong/:chapterid/:chaptername/trang-:page", async function (req: Request, res: Response) {
            const chapterId: number = req.params["chapterid"];
            const page: number = req.params["page"];

            const chapter: Chapter = <Chapter> await chapterService.getById(chapterId);
            
            res.render("../module/exercise-view-by-chapter/view", {
                gradeList: await gradeService.findAll(),
                chapter: chapter,
                ExerciseList: chapter.ExerciseList,
                page: page,
                sort: false
            });
        });

        router.get("/tim-kiem-de-bai-theo-chuong/:chapterid/:chaptername/:content/trang-:page", async function (req: Request, res: Response) {
            const chapterId: number = req.params["chapterid"];
            const page: number = req.params["page"];
            const content: string = req.params["content"];

            const chapter: Chapter = <Chapter> await chapterService.getById(chapterId);
            const ExerciseList: Array<Exercise> = await exerciseService.searchExercise(content,chapterId);
            
            res.render("../module/exercise-view-by-chapter/view", {
                gradeList: await gradeService.findAll(),
                chapter: chapter,
                ExerciseList: ExerciseList,
                page: page,
                sort: true
            });
        });

        

    }
}
