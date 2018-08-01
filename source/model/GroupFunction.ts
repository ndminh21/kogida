import {PrimaryKey, AutoIncrement,  Table,   Model,   Column,   HasMany,   DataType} from 'sequelize-typescript';
import { Function } from "./Function"

@Table
export class GroupFunction extends Model<GroupFunction> {
	@AutoIncrement
	@PrimaryKey
	@Column(DataType.INTEGER)
    GFId: number;

    @Column(DataType.TEXT)
    GFName: string;

    @HasMany(() => Function, "GFId")
    FunctionList: Function[];
}