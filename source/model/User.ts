import { Account } from './Account';
import { Role } from './Role';
import { Subdivision } from './Subdivision';
import {BelongsTo, PrimaryKey, AutoIncrement, Table, Model, Column, BelongsToMany, DataType, HasOne} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
    @PrimaryKey
    @Column(DataType.STRING)
    UserId: string;

    @Column(DataType.STRING)
    FamilyName: string;

    @Column(DataType.STRING)
    GivenName: string;

    @Column(DataType.STRING)
    Workplace: string;

    @Column(DataType.STRING)
    Job: string;

    @Column(DataType.STRING)
    DetailsPlace: string;

    @BelongsTo(() => Subdivision, "PlaceId")
    Place: Subdivision;

    @Column(DataType.STRING)
    DisplayName: string;

    @Column(DataType.STRING)
    AvatarUrl: string;

    @Column(DataType.BOOLEAN)
    Gender: boolean;

    @Column(DataType.STRING)
    PhoneNumber: boolean;

    @Column(DataType.DATE)
    Birthday: Date;

    @BelongsTo(() => Role, "RId")
    Role: Role;

    @HasOne(() => Account,'UserId')
    Account :Account;
}