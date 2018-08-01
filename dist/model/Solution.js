"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exercise_1 = require("./Exercise");
const User_1 = require("./User");
const sequelize_typescript_1 = require("sequelize-typescript");
let Solution = class Solution extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT)
], Solution.prototype, "SolutionId", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Solution.prototype, "Content", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Solution.prototype, "Formula", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Exercise_1.Exercise, "ExerciseId")
], Solution.prototype, "Exercise", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt
], Solution.prototype, "CreatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "CreatedBy")
], Solution.prototype, "CreatedUser", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt
], Solution.prototype, "UpdatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "UpdatedBy")
], Solution.prototype, "UpdatedUser", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BOOLEAN)
], Solution.prototype, "IsPublished", void 0);
Solution = __decorate([
    sequelize_typescript_1.Table
], Solution);
exports.Solution = Solution;
