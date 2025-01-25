import { CreateUserDto } from '../../application/dto/create-user.dto';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { Result } from '../../../../shared/domain/result';
export interface IUserRepository {
    findById(id: number): Promise<Result<User>>;
    findByEmail(email: string): Promise<Result<User>>;
    createUser(user: CreateUserDto): Promise<Result<User>>;
    update(id: number, data: UpdateUserDto): Promise<Result<User>>;
    delete(id: number): Promise<Result<User>>;
} 