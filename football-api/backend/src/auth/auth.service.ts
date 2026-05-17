import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login(userDto: any) {
    if (userDto.username !== 'admin' || userDto.password !== '123456') {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { username: userDto.username, sub: 1 };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
