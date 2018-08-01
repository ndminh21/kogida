import { Exercise } from './Exercise';
import { Unit } from './Unit';
import { Chapter } from './Chapter';
import { User } from './User';
import { BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, BelongsToMany, DataType, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table
export class Solution extends Model<Solution>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    SolutionId: number;

    @Column(DataType.TEXT)
    Content: string;

    @Column(DataType.TEXT)
    Formula: string;

    @BelongsTo(() => Exercise, "ExerciseId")
    Exercise: Exercise;

    @CreatedAt
    CreatedAt: Date;

    @BelongsTo(() => User, "CreatedBy")
    CreatedUser: User;

    @UpdatedAt
    UpdatedAt: Date;

    @BelongsTo(() => User, "UpdatedBy")
    UpdatedUser: User;

    @Column(DataType.BOOLEAN)
    IsPublished: boolean;
}