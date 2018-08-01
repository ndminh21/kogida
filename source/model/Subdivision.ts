import {PrimaryKey, AutoIncrement,  Table,   Model,   Column,   HasMany,   DataType} from 'sequelize-typescript';

@Table
export class Subdivision extends Model<Subdivision> {
    @PrimaryKey
    @Column(DataType.STRING)
    ComId: string;

    @Column(DataType.STRING)
    ComName: string;

    @Column(DataType.STRING)
    DistId: string;

    @Column(DataType.STRING)
    DistName: string;

    @Column(DataType.STRING)
    ProvId: string;

    @Column(DataType.STRING)
    ProvName: string;
}