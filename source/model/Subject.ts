import {PrimaryKey, AutoIncrement,  Table,   Model,   Column,   HasMany,   DataType} from 'sequelize-typescript';
import { Function } from "./Function"

@Table
export class Subject extends Model<Subject> {
	@AutoIncrement
	@PrimaryKey
	@Column(DataType.INTEGER)
    SubjectId: number;

    @Column(DataType.STRING)
    SubjectName: string;
}