"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const FunctionRole_1 = require("./FunctionRole");
const Function_1 = require("./Function");
const sequelize_typescript_1 = require("sequelize-typescript");
let Role = class Role extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], Role.prototype, "RId", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT)
], Role.prototype, "RName", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => Function_1.Function, () => FunctionRole_1.FunctionRole)
], Role.prototype, "FunctionList", void 0);
Role = __decorate([
    sequelize_typescript_1.Table
], Role);
exports.Role = Role;
