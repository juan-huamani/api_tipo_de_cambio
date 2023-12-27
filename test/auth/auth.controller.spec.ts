import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
            imports: [JwtModule],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('login', () => {
        it('should return access token on successful login', async () => {
            const user = { username: 'testuser', password: 'testpassword' };
            const accessToken = 'generated-access-token';

            jest.spyOn(authService, 'login').mockResolvedValueOnce(accessToken);

            const result = await controller.login(user);

            expect(result).toEqual({ accessToken });
        });

        it('should throw unauthorized exception on unsuccessful login', async () => {
            const user = { username: 'invaliduser', password: 'invalidpassword' };

            jest.spyOn(authService, 'login').mockRejectedValueOnce('Invalid credentials');

            await expect(controller.login(user)).rejects.toThrowError(
                new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED),
            );
        });
    });
});
