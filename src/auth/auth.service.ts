import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async login(username: string, password: string): Promise<string> {
        const isValidUser = await this.validateUser(username, password);

        if (!isValidUser) {
        throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { username };
        return this.jwtService.sign(payload);
    }

    public async validateUser(username: string, password: string): Promise<boolean> {
        
        const defaultUsername = 'usuario';
        const defaultPassword = '123456';

        return username === defaultUsername && password === defaultPassword;
    }
}
