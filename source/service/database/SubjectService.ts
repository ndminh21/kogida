import { Subject } from './../../model/Subject';

export default class SubjectService {

	constructor() {
	}
    
    public async addSubject(subjectName: string) {
        return new Subject({ SubjectName: subjectName }).save();
    }

    public async findAll(){
        return Subject.findAll();
    }

    public async findById(subjectId: number){
        return Subject.findById(subjectId);
    }

    public async updateName(subjectId: number, subjectName: string) {
        var subject = await Subject.findById(subjectId);
        return subject.updateAttributes({ SubjectName: subjectName });
    }

    public async deleteSubject(subjectId: number) {
        try {
            var result = await Subject.destroy({ where: { SubjectId: subjectId } });
            return result
        }
        catch (e) {
            return ({ error_message: "Không thể xóa môn học này" })
        }
    }
}