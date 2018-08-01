"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
const sequelize_typescript_1 = require("sequelize-typescript");
const GradeSubject_1 = require("./GradeSubject");
let Exam = class Exam extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT)
], Exam.prototype, "ExamId", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Exam.prototype, "ExamName", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Exam.prototype, "QuestionList", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BOOLEAN)
], Exam.prototype, "IsPublished", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING)
], Exam.prototype, "Secret", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Exam.prototype, "Resubmission", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt
], Exam.prototype, "CreatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "CreatedBy")
], Exam.prototype, "CreatedUser", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt
], Exam.prototype, "UpdatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "UpdatedBy")
], Exam.prototype, "UpdatedUser", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Exam.prototype, "Time", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Exam.prototype, "Structure", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.DATE)
], Exam.prototype, "Deadline", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => GradeSubject_1.GradeSubject, "GradeSubjectId")
], Exam.prototype, "GradeSubject", void 0);
Exam = __decorate([
    sequelize_typescript_1.Table
], Exam);
exports.Exam = Exam;
