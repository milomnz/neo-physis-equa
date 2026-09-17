import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Severity {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
}

@Entity({ name: 'pests' })
export class Pest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
