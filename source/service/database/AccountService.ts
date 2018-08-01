import { Account } from './../../model/Account';

export default class AccountService {

    constructor() {
    }

    public async addUser(value: JSON) {
        return new Account(value).save();
    }

    public async findAll() {
        return Account.findAll({});
    }


    public async update(userID: string, value: Object) {
        var account = await Account.findOne({ where: { UserId: userID } });
        return account.updateAttributes(value);
    }

    public async deleteById(userId: string) {
        return Account.destroy({ where: { UserId: userId } });
    }

    public async findById(userId: string) {
        return Account.findOne({ where: { UserId: userId } });
    }

}