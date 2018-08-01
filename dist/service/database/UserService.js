"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("./../../model/Account");
const Subdivision_1 = require("./../../model/Subdivision");
const User_1 = require("./../../model/User");
const Role_1 = require("./../../model/Role");
class UserService {
    constructor() {
    }
    async addUser(value) {
        return new User_1.User(value).save();
    }
    async getAllocatedUsers() {
        return await User_1.User.findAll({ include: [Role_1.Role, Subdivision_1.Subdivision,
                {
                    model: Account_1.Account,
                    where: {
                        Allocated: true
                    }
                }] });
    }
    async getUsersByProvider(provider) {
        return await User_1.User.findAll({
            include: [Role_1.Role, Subdivision_1.Subdivision,
                {
                    model: Account_1.Account,
                    where: {
                        provider: provider
                    }
                }]
        });
    }
    async findAll() {
        return User_1.User.findAll({ include: [Role_1.Role, Subdivision_1.Subdivision] });
    }
    async update(userID, value) {
        var user = await User_1.User.findOne({ where: { UesrId: userID } });
        return user.updateAttributes(value);
    }
    async deleteById(userId) {
        try {
            var result = User_1.User.destroy({ where: { UserId: userId } });
            return result;
        }
        catch (e) {
            return ({ error_message: "Không thể xóa người dùng này" });
        }
    }
    async findById(userId) {
        return User_1.User.findOne({ where: { UserId: userId }, include: [Role_1.Role, Account_1.Account, Subdivision_1.Subdivision] });
    }
}
exports.default = UserService;
