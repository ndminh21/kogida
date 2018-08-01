import { Unit } from './Unit';
import { Chapter } from './Chapter';
import { User } from './User';
import { HasMany,BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, BelongsToMany, DataType, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Solution } from './Solution';

@Table
export class Exercise extends Model<Exercise>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    ExerciseId: number;

    @Column(DataType.TEXT)
    Content: string;

    @Column(DataType.BOOLEAN)
    NoParameter: boolean;

    @Column(DataType.TEXT)
    Parameter: string;

    @Column(DataType.TEXT)
    Constant: string;

    @BelongsTo(() => Chapter, "ChapterId")
    Chapter: Chapter;

    @Column(DataType.INTEGER)
    Level: number;

    @CreatedAt
    CreatedAt: Date;

    @BelongsTo(() => User, "CreatedBy")
    CreatedUser: User;

    @Column(DataType.INTEGER)
    Importance: number;

    @BelongsTo(() => Unit, "UnitId")
    Unit: Unit;

    @UpdatedAt
    UpdatedAt: Date;

    @BelongsTo(() => User, "UpdatedBy")
    UpdatedUser: User;

    @Column(DataType.BOOLEAN)
    IsPublished: boolean;

    @HasMany(() => Solution, "ExerciseId")
    SolutionList: Solution[];
}