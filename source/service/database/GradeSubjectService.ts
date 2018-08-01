import { Subject } from './../../model/Subject';
import { GradeSubject } from './../../model/GradeSubject';
import { Grade } from '../../model/Grade';

export default class GradeSubjectService {

	constructor() {
	}
    
    public async add(gradeId: number, subjectId: number) {
        return new GradeSubject({ GradeId: gradeId, SubjectId: subjectId }).save();
    }

    public async getById(gradeSubjectId: number) {
        return GradeSubject.findAll({ include: [Grade, Subject], where:{Id : gradeSubjectId} });
    }

    public async getByGradeId(gradeId: number) {
        return GradeSubject.findAll({ include: [Subject], where: { GradeId: gradeId } });
    }


    public async checkExist(gradeId: number, subjectId: number) {
        return GradeSubject.findOne({where : { GradeId: gradeId, SubjectId: subjectId }});
    }

    public async findAll(){
        return GradeSubject.findAll({ include: [Grade, Subject]});
    }

    public async deleteGS(gradeId : number, subjectId : number) {
        try{
            var result = await GradeSubject.destroy({ where: { GradeId: gradeId, SubjectId: subjectId } });
            return result
        }
        catch(e){
            return ({error_message: "Không thể  phân công môn học này"})
        }
    }
}