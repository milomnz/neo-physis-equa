import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Farm } from '../../farms/entities/farm.entity';

export enum UserRole {
  PRODUCTOR = 'productor',
  COLABORADOR = 'colaborador',
  ADMIN = 'admin',
}

export enum DisabilityType {
  MOTORA = 'motora',
  VISUAL = 'visual',
  AUDITIVA = 'auditiva',
  INTELECTUAL = 'intelectual',
  NINGUNA = 'ninguna',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role',
    default: UserRole.PRODUCTOR,
  })
  role: UserRole;

  @Column({
    type: 'jsonb',
    name: 'accessibility_profile',
    default: {},
  })
  accessibilityProfile: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: DisabilityType,
    enumName: 'disability_type',
    name: 'disability_type',
    nullable: true,
  })
  disabilityType: DisabilityType | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Farm, (farm) => farm.owner)
  farms: Farm[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}