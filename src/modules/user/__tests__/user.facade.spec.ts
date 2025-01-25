import { Test, TestingModule } from '@nestjs/testing';
import { UserFacade } from '../application/facades/user.facade';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/commands/create-user.command';
import { GetUserByIdQuery } from '../application/use-cases/queries/get-user-by-id.query';
import { GetUserByEmailQuery } from '../application/use-cases/queries/get-user-by-email.query';
import { Result } from '../../../shared/domain/result';
import { PasswordHashService } from '../domain/services/password-hash.service';

describe('UserFacade', () => {
    let userFacade: UserFacade;
    let commandBus: CommandBus;
    let queryBus: QueryBus;
    let passwordHashService: PasswordHashService;

    const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        phone: '+1234567890',
        password: 'hashedPassword123'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserFacade,
                {
                    provide: CommandBus,
                    useValue: { execute: jest.fn() }
                },
                {
                    provide: QueryBus,
                    useValue: { execute: jest.fn() }
                },
                {
                    provide: PasswordHashService,
                    useValue: { comparePassword: jest.fn() }
                }
            ]
        }).compile();

        userFacade = module.get<UserFacade>(UserFacade);
        commandBus = module.get<CommandBus>(CommandBus);
        queryBus = module.get<QueryBus>(QueryBus);
        passwordHashService = module.get<PasswordHashService>(PasswordHashService);
    });

    describe('createUser', () => {
        const createUserDto = {
            email: mockUser.email,
            password: 'password123',
            name: mockUser.name,
            phone: mockUser.phone
        };

        it('should successfully create a user', async () => {
            const expectedResult = Result.ok(mockUser);
            jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

            const result = await userFacade.createUser(createUserDto);

            expect(commandBus.execute).toHaveBeenCalledWith(new CreateUserCommand(createUserDto));
            expect(result).toBe(expectedResult);
        });

        it('should handle creation failure', async () => {
            const expectedError = Result.fail('Email already exists');
            jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedError);

            const result = await userFacade.createUser(createUserDto);

            expect(result.isFailure).toBe(true);
            expect(result.error).toBe('Email already exists');
        });
    });

    describe('findUserById', () => {
        it('should successfully find a user by id', async () => {
            const expectedResult = Result.ok(mockUser);
            jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

            const result = await userFacade.findUserById(mockUser.id);

            expect(queryBus.execute).toHaveBeenCalledWith(new GetUserByIdQuery(mockUser.id));
            expect(result).toBe(expectedResult);
        });

        it('should handle user not found', async () => {
            const expectedError = Result.fail('User not found');
            jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedError);

            const result = await userFacade.findUserById(999);

            expect(result.isFailure).toBe(true);
            expect(result.error).toBe('User not found');
        });
    });

    describe('findUserByEmail', () => {
        it('should successfully find a user by email', async () => {
            const expectedResult = Result.ok(mockUser);
            jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

            const result = await userFacade.findUserByEmail(mockUser.email);

            expect(queryBus.execute).toHaveBeenCalledWith(new GetUserByEmailQuery(mockUser.email));
            expect(result).toBe(expectedResult);
        });
    });

    describe('comparePassword', () => {
        it('should return true for matching passwords', async () => {
            jest.spyOn(passwordHashService, 'comparePassword').mockResolvedValue(true);

            const result = await userFacade.comparePassword('password123', mockUser.password);

            expect(passwordHashService.comparePassword).toHaveBeenCalledWith('password123', mockUser.password);
            expect(result).toBe(true);
        });

        it('should return false for non-matching passwords', async () => {
            jest.spyOn(passwordHashService, 'comparePassword').mockResolvedValue(false);

            const result = await userFacade.comparePassword('wrongpassword', mockUser.password);

            expect(result).toBe(false);
        });
    });
}); 