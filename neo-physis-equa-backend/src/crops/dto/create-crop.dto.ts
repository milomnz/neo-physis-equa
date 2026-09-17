import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { GrowthStage } from '../entities/crop.entity';

export class CreateCropDto {
  @IsUUID()
  @IsNotEmpty()
  farmId: string;

  @IsString()
  @IsNotEmpty()
  species: string;

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
