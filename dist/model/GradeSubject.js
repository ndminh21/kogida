"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Grade_1 = require("./Grade");
const sequelize_typescript_1 = require("sequelize-typescript");
const Subject_1 = require("./Subject");
let GradeSubject = class GradeSubject extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], GradeSubject.prototype, "Id", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Grade_1.Grade),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], GradeSubject.prototype, "GradeId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Grade_1.Grade, "GradeId")
], GradeSubject.prototype, "grade", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Subject_1.Subject),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER)
], GradeSubject.prototype, "SubjectId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Subject_1.Subject, "SubjectId")
], GradeSubject.prototype, "subject", void 0);
GradeSubject = __decorate([
    sequelize_typescript_1.Table
], GradeSubject);
exports.GradeSubject = GradeSubject;
