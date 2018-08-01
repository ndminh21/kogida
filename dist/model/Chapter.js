"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const GradeSubject_1 = require("./GradeSubject");
const User_1 = require("./User");
const Unit_1 = require("./Unit");
const Exercise_1 = require("./Exercise");
let Chapter = class Chapter extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Chapter.prototype, "ChapterId", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING)
], Chapter.prototype, "ChapterName", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Chapter.prototype, "ChapterOrder", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => GradeSubject_1.GradeSubject, "GSId")
], Chapter.prototype, "gradeSubject", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "CreatedBy")
], Chapter.prototype, "CreatedUser", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "UpdatedBy")
], Chapter.prototype, "UpdatedUser", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Chapter.prototype, "Content", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt
], Chapter.prototype, "CreatedAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt
], Chapter.prototype, "UpdatedAt", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Unit_1.Unit, "ChapterId")
], Chapter.prototype, "UnitList", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Exercise_1.Exercise, "ChapterId")
], Chapter.prototype, "ExerciseList", void 0);
Chapter = __decorate([
    sequelize_typescript_1.Table
], Chapter);
exports.Chapter = Chapter;
