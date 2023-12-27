import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty,ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

class LoginDto {
    @ApiProperty({ description: 'Nombre de usuario', example: 'usuario' })
    username: string;

    @ApiProperty({ description: 'Contraseña del usuario', example: '123456' })
    password: string;
}

@ApiTags('Seguridad')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Obtener el Token de Seguridad' })
    @ApiResponse({ status: 201, description: 'Token creado correctamente' })
    @ApiBody({
        description: 'Credenciales de usuario para iniciar sesión',
        type: LoginDto,
    })
    async login(@Body() user: LoginDto): Promise<{ accessToken: string }> {
        try {
            const token = await this.authService.login(user.username, user.password);
            return { accessToken: token };
        } catch (error) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

    }
}


