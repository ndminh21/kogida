import { Grade } from './Grade';
import {BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, BelongsToMany, DataType, ForeignKey} from 'sequelize-typescript';
import { Function } from './Function';
import { Role } from './Role';
import { Subject } from './Subject';

@Table
export class GradeSubject extends Model<GradeSubject> {
    @AutoIncrement
	@PrimaryKey
	@Column(DataType.INTEGER)
    Id: number;

    @ForeignKey(() => Grade)
    @Column(DataType.INTEGER)
    GradeId: number;

    @BelongsTo(() => Grade, "GradeId")
    grade: Grade;

    @ForeignKey(() => Subject)
    @Column(DataType.INTEGER)
    SubjectId: number;

    @BelongsTo(() => Subject, "SubjectId")
    subject: Subject;
}