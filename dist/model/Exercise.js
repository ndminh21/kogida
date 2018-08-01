"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Unit_1 = require("./Unit");
const Chapter_1 = require("./Chapter");
const User_1 = require("./User");
const sequelize_typescript_1 = require("sequelize-typescript");
const Solution_1 = require("./Solution");
let Exercise = class Exercise extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BIGINT)
], Exercise.prototype, "ExerciseId", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Exercise.prototype, "Content", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BOOLEAN)
], Exercise.prototype, "NoParameter", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Exercise.prototype, "Parameter", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Exercise.prototype, "Constant", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Chapter_1.Chapter, "ChapterId")
], Exercise.prototype, "Chapter", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Exercise.prototype, "Level", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt
], Exercise.prototype, "CreatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "CreatedBy")
], Exercise.prototype, "CreatedUser", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Exercise.prototype, "Importance", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Unit_1.Unit, "UnitId")
], Exercise.prototype, "Unit", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt
], Exercise.prototype, "UpdatedAt", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "UpdatedBy")
], Exercise.prototype, "UpdatedUser", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BOOLEAN)
], Exercise.prototype, "IsPublished", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Solution_1.Solution, "ExerciseId")
], Exercise.prototype, "SolutionList", void 0);
Exercise = __decorate([
    sequelize_typescript_1.Table
], Exercise);
exports.Exercise = Exercise;
