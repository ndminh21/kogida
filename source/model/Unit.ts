import { BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, HasMany, DataType, ForeignKey, CreatedAt, UpdatedAt, HasOne } from 'sequelize-typescript';
import { Chapter } from './Chapter';
import { User } from './User';

@Table
export class Unit extends Model<Unit> {
    @AutoIncrement
	@PrimaryKey
	@Column(DataType.INTEGER)
    UnitId: number;

    @Column(DataType.STRING)
    UnitName: string;

    @Column(DataType.INTEGER)
    UnitOrder: number;

    @BelongsTo(() => Chapter, "ChapterId")
    Chapter: Chapter;

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
}