import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { UpdateUserCommand } from '../commands/update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(command: UpdateUserCommand) {
        const { id, user } = command;
        return this.userRepository.update(id, user);
    }
}