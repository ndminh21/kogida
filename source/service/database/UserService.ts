import { Account } from './../../model/Account';
import { Subdivision } from './../../model/Subdivision';
import { User } from './../../model/User';
import { Role } from './../../model/Role';
export default class UserService {

    constructor() {
    }

    public async addUser(value: JSON) {
        return new User(value).save();
    }

    public async getAllocatedUsers(){
        return await User.findAll({include : [Role,Subdivision,
            {
                model :Account, 
                where : {
                    Allocated : true
            }}]})     
    }

    public async getUsersByProvider(provider : string) {
        return await User.findAll({
            include: [Role, Subdivision,
                {
                    model: Account,
                    where: {
                        provider: provider
                    }
                }]
        })
    }

    public async findAll() {
        return User.findAll({ include: [Role,Subdivision] });
    }


    public async update(userID: string, value: Object) {
        var user = await User.findOne({ where: { UesrId: userID } });
        return user.updateAttributes(value);
    }

    public async deleteById(userId: string) {
        try {
            var result = User.destroy({ where: { UserId: userId } });
            return result
        }
        catch (e) {
            return ({ error_message: "Không thể xóa người dùng này" })
        } 
    }

    public async findById(userId: string) {
        return User.findOne({ where: { UserId: userId }, include :[Role,Account,Subdivision]});
    }

}