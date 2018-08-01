import { FunctionRole } from './FunctionRole';
import { Function } from './Function';
import {BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, BelongsToMany, DataType} from 'sequelize-typescript';

@Table
export class Role extends Model<Role> {
    @AutoIncrement
	@PrimaryKey
	@Column(DataType.INTEGER)
    RId: number;

    @Column(DataType.TEXT)
    RName: string;

    @BelongsToMany(() => Function, () => FunctionRole)
    FunctionList: Function[];
}