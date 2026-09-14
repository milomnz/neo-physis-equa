import { IsBoolean, IsEmail, IsEnum, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { DisabilityType, UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsObject()
  accessibilityProfile?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(DisabilityType)
  disabilityType?: DisabilityType;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser booleano' })
  isActive?: boolean;
}