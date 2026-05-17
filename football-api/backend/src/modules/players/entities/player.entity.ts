import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'players' })
export class Player extends Model {
  rating: number;
speed: number;
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  Playerid!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  club!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  position!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  nationality!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  version_year!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 50 })
  pace!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 50 })
  shooting!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 50 })
  passing!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 50 })
  dribbling!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 50 })
  defending!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 50 })
  physical!: number;
}
