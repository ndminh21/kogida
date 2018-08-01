import { Subdivision } from './../../model/Subdivision';
import  ExcelService from '../other/ExcelService'

export default class SubdivisionService {

	constructor() {
	}

    /**
     * Add a subdivision
     */
    
    public async addSubdivision(value: JSON) {
        return  new Subdivision(value).save()
    }

    public async findAll(){
            return Subdivision.findAll();
    }

    public async getByComId( ComId : string){
            return Subdivision.findOne({where: {ComId : ComId}})
            
    }
    public async deleteAll() {
        return Subdivision.destroy({where : {}});
    }
}