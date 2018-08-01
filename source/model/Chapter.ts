import { BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, HasMany, DataType, ForeignKey, CreatedAt, UpdatedAt, HasOne } from 'sequelize-typescript';
import { GradeSubject } from './GradeSubject';
import { User } from './User';
import { Unit } from './Unit';
import { Exercise } from './Exercise';

@Table
export class Chapter extends Model<Chapter> {
    @AutoIncrement
	@PrimaryKey
	@Column(DataType.INTEGER)
    ChapterId: number;

    @Column(DataType.STRING)
    ChapterName: string;

    @Column(DataType.INTEGER)
    ChapterOrder: number;

    @BelongsTo(() => GradeSubject, "GSId")
    gradeSubject: GradeSubject;

    @BelongsTo(() => User, "CreatedBy")
    CreatedUser: User;

    @BelongsTo(() => User, "UpdatedBy")
    UpdatedUser: User;

    @Column(DataType.TEXT)
    Content: string;

    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @HasMany(() => Unit, "ChapterId")
    UnitList: Unit[];

    @HasMany(() => Exercise, "ChapterId")
    ExerciseList: Exercise[];
}