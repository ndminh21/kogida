import {PrimaryKey, AutoIncrement,  Table,   Model,   Column,   HasMany,   DataType} from 'sequelize-typescript';
import { Function } from "./Function"

@Table
export class Grade extends Model<Grade> {
	@AutoIncrement
	@PrimaryKey
	@Column(DataType.INTEGER)
    GradeId: number;

    @Column(DataType.STRING)
    GradeName: string;
}