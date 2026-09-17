import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Severity } from '../entities/pest.entity';

export class UpdatePestDto {
  @IsString()
  @IsOptional()
  commonName?: string;

  @IsString()
  @IsOptional()
  scientificName?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  affectedCrops?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  symptoms?: string[];

  @IsEnum(Severity)
  @IsOptional()
  severity?: Severity;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageReferences?: string[];
}
