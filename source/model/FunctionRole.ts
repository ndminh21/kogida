import {BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, BelongsToMany, DataType, ForeignKey} from 'sequelize-typescript';
import { Function } from './Function';
import { Role } from './Role';

@Table
export class FunctionRole extends Model<FunctionRole> {
    @ForeignKey(() => Role)
    @Column(DataType.INTEGER)
    RoleId: number;

    @ForeignKey(() => Function)
    @Column(DataType.INTEGER)
    FunctionId: number;
}