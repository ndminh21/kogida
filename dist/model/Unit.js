"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Chapter_1 = require("./Chapter");
const User_1 = require("./User");
let Unit = class Unit extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Unit.prototype, "UnitId", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING)
], Unit.prototype, "UnitName", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Unit.prototype, "UnitOrder", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Chapter_1.Chapter, "ChapterId")
], Unit.prototype, "Chapter", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "CreatedBy")
], Unit.prototype, "CreatedUser", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, "UpdatedBy")
], Unit.prototype, "UpdatedUser", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Unit.prototype, "Content", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt
], Unit.prototype, "CreatedAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt
], Unit.prototype, "UpdatedAt", void 0);
Unit = __decorate([
    sequelize_typescript_1.Table
], Unit);
exports.Unit = Unit;
