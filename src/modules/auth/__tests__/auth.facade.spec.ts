import { Test, TestingModule } from '@nestjs/testing';
import { AuthFacade } from '../application/facades/auth.facade';
import { CommandBus } from '@nestjs/cqrs';
import { UserFacade } from '../../user/application/facades/user.facade';
import { LoginCommand } from '../application/use-cases/commands/login.command';
import { RegisterCommand } from '../application/use-cases/commands/register.command';
import { LogoutCommand } from '../application/use-cases/commands/logout.command';
import { Result } from '../../../shared/domain/result';
import { User } from '../../user/domain/entities/user.entity';

describe('AuthFacade', () => {
    let sut: AuthFacade;
    let commandBusMock: CommandBus;
    let userFacadeMock: UserFacade;

    const mockData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phone: '+1234567890',
        stripeId: 'stripe_123',
        id: 1,
    } as const;

    const createMockUser = (): User => new User(
        mockData.email,
        mockData.password,
        mockData.name,
        mockData.stripeId,
        mockData.phone,
        mockData.id,
        0
    );

    const mockTokenData = {
        accessToken: 'jwt.token.here',
        expiresIn: new Date()
    } as const;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthFacade,
                {
                    provide: CommandBus,
                    useValue: { execute: jest.fn() }
                },
                {
                    provide: UserFacade,
                    useValue: { findUserById: jest.fn() }
                }
            ]
        }).compile();

        sut = module.get<AuthFacade>(AuthFacade);
        commandBusMock = module.get<CommandBus>(CommandBus);
        userFacadeMock = module.get<UserFacade>(UserFacade);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should successfully login user when credentials are valid', async () => {
            const expectedResult = Result.ok(mockTokenData);
            jest.spyOn(commandBusMock, 'execute').mockResolvedValue(expectedResult);

            const result = await sut.login(mockData.email, mockData.password);

            expect(commandBusMock.execute).toHaveBeenCalledWith(
                new LoginCommand(mockData.email, mockData.password)
            );
            expect(result).toBe(expectedResult);
        });

        it('should return failure result when credentials are invalid', async () => {
            const expectedError = Result.fail('Invalid credentials');
            jest.spyOn(commandBusMock, 'execute').mockResolvedValue(expectedError);

            const result = await sut.login(mockData.email, 'wrongpassword');
            expect(result._isSuccess).toBe(false);
            expect(result._error).toBe('Invalid credentials');
        });
    });

    describe('register', () => {
        const registerDto = {
            email: mockData.email,
            password: mockData.password,
            name: mockData.name,
            phone: mockData.phone
        };

        it('should successfully register user', async () => {
            const expectedResult = Result.ok(createMockUser());
            jest.spyOn(commandBusMock, 'execute').mockResolvedValue(expectedResult);

            const result = await sut.register(registerDto);

            expect(commandBusMock.execute).toHaveBeenCalledWith(
                new RegisterCommand(registerDto)
            );
            expect(result).toBe(expectedResult);
        });

        it('should handle registration failure', async () => {
            const expectedError = Result.fail('Email already exists');
            jest.spyOn(commandBusMock, 'execute').mockResolvedValue(expectedError);

            const result = await sut.register(registerDto);

            expect(result._isSuccess).toBe(false);
            expect(result._error).toBe('Email already exists');
        });
    });

    describe('logout', () => {
        it('should successfully logout user', async () => {
            const expectedResult = Result.ok();
            jest.spyOn(commandBusMock, 'execute').mockResolvedValue(expectedResult);
            jest.spyOn(userFacadeMock, 'findUserById').mockResolvedValue(Result.ok(createMockUser()));

            const result = await sut.logout(mockData.id);

            expect(commandBusMock.execute).toHaveBeenCalledWith(
                new LogoutCommand(mockData.id)
            );
            expect(result).toBe(expectedResult);
        });
    });
}); 