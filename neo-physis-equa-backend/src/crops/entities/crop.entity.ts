import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Farm } from '../../farms/entities/farm.entity';

export enum GrowthStage {
  VEGETATIVO = 'vegetativo',
  FLORACION = 'floración',
  FRUCTIFICACION = 'fructificación',
  PRODUCCION = 'producción',
}

@Entity({ name: 'crops' })
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farm_id', type: 'uuid' })
  farmId: string;

  @ManyToOne(() => Farm, (farm) => farm.crops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farm_id' })
  farm: Farm;

  @Column({ type: 'varchar', length: 255 })
  species: string;

  @Column({ type: 'timestamptz', nullable: true })
  plantedDate: Date;

  @Column({
    type: 'enum',
    enum: GrowthStage,
    default: GrowthStage.VEGETATIVO,
  })
  growthStage: GrowthStage;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
