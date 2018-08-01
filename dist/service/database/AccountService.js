"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("./../../model/Account");
class AccountService {
    constructor() {
    }
    async addUser(value) {
        return new Account_1.Account(value).save();
    }
    async findAll() {
        return Account_1.Account.findAll({});
    }
    async update(userID, value) {
        var account = await Account_1.Account.findOne({ where: { UserId: userID } });
        return account.updateAttributes(value);
    }
    async deleteById(userId) {
        return Account_1.Account.destroy({ where: { UserId: userId } });
    }
    async findById(userId) {
        return Account_1.Account.findOne({ where: { UserId: userId } });
    }
}
exports.default = AccountService;
