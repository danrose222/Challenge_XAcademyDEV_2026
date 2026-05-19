import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión para obtener el Token de acceso (JWT)' })
  @ApiBody({
    description: 'Credenciales de acceso',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: '123456' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Retorna el Token JWT.' })
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
