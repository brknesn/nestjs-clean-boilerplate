import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { Result } from '../../../../../shared/domain/result';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async execute(command: CreateUserCommand) {
        const { user } = command;
        const checkIfEmailExists = await this.userRepository.findByEmail(user.email);

        if (checkIfEmailExists.isSuccess) {
            return Result.fail('Email already exists');
        }

        const createUserDto: CreateUserDto = {
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone,
            stripeId: user.stripeId,
            tokenVersion: user.tokenVersion
        };

        return this.userRepository.createUser(createUserDto);
    }
}