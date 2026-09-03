import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(createUserDto: CreateUserDto) {
    const userExists = await this.usersRepository.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('El correo ya se encuentra registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const { password, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('Credenciales inválidas: usuario o contraseña incorrectos');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Credenciales inválidas: usuario o contraseña incorrectos');
    }

    const { password, ...result } = user;
    return {
      message: 'Inicio de sesión exitoso',
      user: result,
    };
  }
}