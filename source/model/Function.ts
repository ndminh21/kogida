import { GroupFunction } from './GroupFunction';
import {BelongsTo, PrimaryKey,  AutoIncrement,   Table,    Model,    Column,    HasMany,    DataType} from 'sequelize-typescript';

@Table
export class Function extends Model<Function> {
    @AutoIncrement
	@PrimaryKey
	@Column(DataType.INTEGER)
    FId: number;

    @Column(DataType.TEXT)
    FName: string;

    @Column(DataType.TEXT)
    FUrl: string;

    @Column(DataType.TEXT)
    FMethod: string;

    @Column(DataType.BOOLEAN)
    FDisplay: boolean;

    @BelongsTo(() => GroupFunction, "GFId")
    GFunction: GroupFunction;
}