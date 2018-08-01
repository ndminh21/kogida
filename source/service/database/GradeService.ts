import { Grade } from './../../model/Grade';
import GradeSubjectService from './GradeSubjectService'
export default class GradeService {

	constructor() {
	}
    
    public async addGrade(gradeName: string) {
        return new Grade({ GradeName: gradeName }).save();
    }

    public async findAll(){
        let gradeSubjectService = new GradeSubjectService();
        var allGrade = await Grade.findAll();
        return Promise.all(allGrade.map(async (x) => {
            var gradeSubject = await gradeSubjectService.getByGradeId(x.toJSON().GradeId);
            var subjectList = gradeSubject.map((x) => x.toJSON().subject)
            return {...x.toJSON(), subjectList }
        }))
    }

    public async findById(gradeId: number){
        return Grade.findById(gradeId);
    }

    public async updateName(gradeId: number, gradeName: string) {
        var grade = await Grade.findById(gradeId);
        return grade.updateAttributes({ GradeName: gradeName });
    }

    public async deleteGrade(gradeId: number) {
        try{
            var result = await Grade.destroy({ where: { GradeId: gradeId } });
            return result
        }
        catch(e){
            return ({error_message : "Không thể xóa khối/lớp này"})
        }
        
    }
}