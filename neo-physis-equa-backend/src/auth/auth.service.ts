import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthResponse } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registro(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const user = await this.usersService.create(dto);
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      token,
      id: user.id,
      nombre: user.name,
      email: user.email,
      mensaje: 'Registro exitoso',
      role: user.role,
      accessibilityProfile: user.accessibilityProfile,
      disabilityType: user.disabilityType,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      token,
      id: user.id,
      nombre: user.name,
      email: user.email,
      mensaje: 'Login exitoso',
      role: user.role,
      accessibilityProfile: user.accessibilityProfile,
      disabilityType: user.disabilityType,
    };
  }

  async perfil(id: string): Promise<AuthResponse> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return {
      token: null,
      id: user.id,
      nombre: user.name,
      email: user.email,
      mensaje: 'Usuario autenticado',
      role: user.role,
      accessibilityProfile: user.accessibilityProfile,
      disabilityType: user.disabilityType,
    };
  }
}
