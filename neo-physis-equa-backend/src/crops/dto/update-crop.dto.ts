import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { GrowthStage } from '../entities/crop.entity';

export class UpdateCropDto {
  @IsUUID()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  species?: string;

  @IsDateString()
  @IsOptional()
  plantedDate?: Date;

  @IsEnum(GrowthStage)
  @IsOptional()
  growthStage?: GrowthStage;

  @IsString()
  @IsOptional()
  notes?: string;
}
