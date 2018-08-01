import { Unit } from './Unit';
import { Chapter } from './Chapter';
import { User } from './User';
import { HasMany,BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, BelongsToMany, DataType, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Solution } from './Solution';
import { GradeSubject } from './GradeSubject';


@Table
export class Exam extends Model<Exam>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    ExamId: number;

    @Column(DataType.TEXT)
    ExamName: string;

    @Column(DataType.TEXT)
    QuestionList: string;

    @Column(DataType.BOOLEAN)
    IsPublished: boolean;

    @Column(DataType.STRING)
    Secret: string;

    @Column(DataType.INTEGER)
    Resubmission: number;

    @CreatedAt
    CreatedAt: Date;

    @BelongsTo(() => User, "CreatedBy")
    CreatedUser: User;

    @UpdatedAt
    UpdatedAt: Date;

    @BelongsTo(() => User, "UpdatedBy")
    UpdatedUser: User;

    @Column(DataType.INTEGER)
    Time: number;

    @Column(DataType.TEXT)
    Structure: string;

    @Column(DataType.DATE)
    Deadline: Date;

    @BelongsTo(() => GradeSubject, "GradeSubjectId")
    GradeSubject: GradeSubject;
}