import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Crop } from '../../crops/entities/crop.entity';

export enum Severity {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
}

@Entity({ name: 'pests' })
export class Pest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'crop_id', type: 'uuid' })
  cropId: string;

  @ManyToOne(() => Crop, (crop) => crop.pests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'crop_id' })
  crop: Crop;

  @Column({ type: 'varchar', length: 255 })
  commonName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  scientificName: string;

  @Column({ type: 'jsonb', default: [] })
  affectedCrops: string[];

  @Column({ type: 'jsonb', default: [] })
  symptoms: string[];

  @Column({
    type: 'enum',
    enum: Severity,
    default: Severity.MEDIA,
  })
  severity: Severity;

  @Column({ type: 'jsonb', default: [] })
  imageReferences: string[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
