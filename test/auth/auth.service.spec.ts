import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [AuthService, JwtService],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should return an access token on successful login', async () => {
        // Arrange
        const username = 'usuario';
        const password = '123456';
        const expectedToken = 'generated_access_token';

        // Mock validateUser method
        jest.spyOn(service as any, 'validateUser').mockResolvedValueOnce(true);

        // Mock JwtService's sign method
        jest.spyOn(jwtService, 'sign').mockReturnValueOnce(expectedToken);

        // Act
        const result = await service.login(username, password);

        // Assert
        expect(result).toEqual(expectedToken);
        });

        it('should throw UnauthorizedException on unsuccessful login', async () => {
        // Arrange
        const username = 'invalid_user';
        const password = 'invalid_password';

        // Mock validateUser method to return false
        jest.spyOn(service as any, 'validateUser').mockResolvedValueOnce(false);

        // Act and Assert
        await expect(service.login(username, password)).rejects.toThrowError(UnauthorizedException);
        });
    });

    describe('validateUser', () => {
        it('should return true for valid user credentials', async () => {
        // Arrange
        const username = 'usuario';
        const password = '123456';

        // Act
        const result = await service.validateUser(username, password);

        // Assert
        expect(result).toBe(true);
        });

        it('should return false for invalid user credentials', async () => {
        // Arrange
        const username = 'invalid_user';
        const password = 'invalid_password';

        // Act
        const result = await service.validateUser(username, password);

        // Assert
        expect(result).toBe(false);
        });
    });
});

