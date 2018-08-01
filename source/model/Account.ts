import { User } from './User';
import { BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, BelongsToMany, DataType, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({ updatedAt :false})
export class Account extends Model<Account>{
    @PrimaryKey
    @ForeignKey(() => User)
    @Column(DataType.STRING)
    UserId: string;

    @Column(DataType.STRING)
    Password: string;

    @Column(DataType.STRING)
    Provider: string;

    @Column(DataType.BOOLEAN)
    Banned:Boolean

    @Column(DataType.BOOLEAN)
    Allocated: Boolean

    @CreatedAt
    CreatedAt : Date

}