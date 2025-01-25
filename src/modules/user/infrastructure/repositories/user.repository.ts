import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { PasswordHashService } from '../../domain/services/password-hash.service';
import { Result } from '../../../../shared/domain/result';
/**
 * Repository implementation for User entity using Prisma ORM
 * @class UserRepository
 * @implements {IUserRepository}
 */

@Injectable()
export class UserRepository implements IUserRepository {
    /**
     * Constructs a new UserRepository instance
     * @param {PrismaService} prisma - The Prisma service instance
     * @param {UserMapper} mapper - The user mapper instance
     */
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: UserMapper,
        private readonly passwordHashService: PasswordHashService
    ) { }

    /**
     * Finds a user by their ID
     * @param {number} id - The user's ID
     * @returns {Promise<Result<User>>} The found user or error
     */
    async findById(id: number): Promise<Result<User>> {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                return Result.fail<User>('User not found');
            }
            return Result.ok(this.mapper.toDomain(user));
        } catch (error) {
            return Result.fail<User>('Error finding user');
        }
    }

    /**
     * Creates a new user
     * @param {CreateUserDto} dto - The user creation data
     * @returns {Promise<Result<User>>} The created user or error
     */
    async createUser(dto: CreateUserDto): Promise<Result<User>> {
        try {
            const passwordHash = await this.passwordHashService.hashPassword(dto.password);
            const persistenceData = {
                email: dto.email,
                password: passwordHash,
                name: dto.name,
                phone: dto.phone,
                stripeId: dto.stripeId,
                tokenVersion: dto.tokenVersion
            };
            const user = await this.prisma.user.create({ data: persistenceData });
            return Result.ok(this.mapper.toDomain(user));
        } catch (error) {
            console.log(error);
            return Result.fail<User>('Error creating user');
        }
    }

    /**
     * Finds a user by their email address
     * @param {string} email - The user's email
     * @returns {Promise<Result<User>>} The found user or error
     */
    async findByEmail(email: string): Promise<Result<User>> {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return Result.fail<User>('User not found');
            }
            return Result.ok(this.mapper.toDomain(user));
        } catch (error) {
            return Result.fail<User>('Error finding user');
        }
    }

    /**
     * Finds a user by their phone number
     * @param {string} phone - The user's phone number
     * @returns {Promise<Result<User>>} The found user or error
     */
    async findByPhone(phone: string): Promise<Result<User>> {
        try {
            const user = await this.prisma.user.findFirst({ where: { phone } });
            if (!user) {
                return Result.fail<User>('User not found');
            }
            return Result.ok(this.mapper.toDomain(user));
        } catch (error) {
            return Result.fail<User>('Error finding user');
        }
    }

    /**
     * Finds all users
     * @returns {Promise<Result<User[]>>} The found users or error
     */
    async findAll(): Promise<Result<User[]>> {
        try {
            const users = await this.prisma.user.findMany();
            return Result.ok(users.map(this.mapper.toDomain));
        } catch (error) {
            return Result.fail<User[]>('Error finding users');
        }
    }

    /**
     * Updates a user
     * @param {number} id - The user's ID
     * @param {UpdateUserDto} data - The user update data
     * @returns {Promise<Result<User>>} The updated user or error
     */
    async update(id: number, data: UpdateUserDto): Promise<Result<User>> {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: this.mapper.toPersistence(data)
            });
            return Result.ok(this.mapper.toDomain(user));
        } catch (error) {
            return Result.fail<User>('Error updating user');
        }
    }

    /**
     * Deletes a user
     * @param {number} id - The user's ID
     * @returns {Promise<Result<User>>} The deleted user or error
     */
    async delete(id: number): Promise<Result<User>> {
        try {
            const user = await this.prisma.user.delete({ where: { id } });
            return Result.ok(this.mapper.toDomain(user));
        } catch (error) {
            return Result.fail<User>('Error deleting user');
        }
    }
}