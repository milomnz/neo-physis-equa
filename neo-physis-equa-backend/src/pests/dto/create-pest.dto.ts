import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Severity } from '../entities/pest.entity';

export class CreatePestDto {
  @IsUUID()
  @IsNotEmpty()
  cropId: string;

  @IsString()
  @IsNotEmpty()
  commonName: string;

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
