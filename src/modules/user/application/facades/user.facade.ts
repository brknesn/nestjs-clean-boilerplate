import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../use-cases/commands/create-user.command';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserByIdQuery } from '../use-cases/queries/get-user-by-id.query';
import { GetUserByEmailQuery } from '../use-cases/queries/get-user-by-email.query';
import { UpdateUserCommand } from '../use-cases/commands/update-user.command';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../../domain/entities/user.entity';
import { PasswordHashService } from '../../domain/services/password-hash.service';
import { Result } from '../../../../shared/domain/result';
/**
 * Facade for user-related operations
 * @class UserFacade
 */
@Injectable()
export class UserFacade {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly passwordHash: PasswordHashService,
    ) { }

    /**
     * Creates a new user
     * @param {CreateUserDto} dto - The user creation data
     * @returns {Promise<Result<User>>} The created user or error
     * @throws {ValidationError} When input validation fails
     */
    async createUser(dto: CreateUserDto): Promise<Result<User>> {
        return this.commandBus.execute(new CreateUserCommand(dto));
    }

    /**
     * Finds a user by their ID
     * @param {number} userId - The user's ID
     * @returns {Promise<Result<User>>} The found user or error
     */
    async findUserById(userId: number): Promise<Result<User>> {
        return this.queryBus.execute(new GetUserByIdQuery(userId));
    }

    /**
     * Finds a user by their email address
     * @param {string} email - The user's email
     * @returns {Promise<Result<User>>} The found user or error
     */
    async findUserByEmail(email: string): Promise<Result<User>> {
        return this.queryBus.execute(new GetUserByEmailQuery(email));
    }

    /**
     * Updates a user's information
     * @param {number} id - The user's ID
     * @param {UpdateUserDto} user - The update data
     * @returns {Promise<Result<User>>} The updated user or error
     */
    async updateUser(id: number, user: UpdateUserDto): Promise<Result<User>> {
        return this.commandBus.execute(new UpdateUserCommand(id, user));
    }

    /**
     * Compares a password with a hashed password
     * @param {string} password - The password to compare
     * @param {string} hashedPassword - The hashed password to compare against
     * @returns {Promise<boolean>} Whether the passwords match
     */
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return this.passwordHash.comparePassword(password, hashedPassword);
    }
}
