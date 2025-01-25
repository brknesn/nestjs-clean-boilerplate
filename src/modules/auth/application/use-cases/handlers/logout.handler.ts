import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../commands/logout.command';
import { Result } from '../../../../../shared/domain/result';
import { UserFacade } from '../../../../user/application/facades/user.facade';

/**
 * Handles user logout by invalidating their current token
 * by incrementing the token version
 */
@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
    constructor(private readonly userFacade: UserFacade) { }

    async execute(command: LogoutCommand): Promise<Result<void>> {
        const { userId } = command;
        const userResult = await this.userFacade.findUserById(userId);
        if (userResult.isFailure) {
            return Result.fail(userResult.error);
        }
        const tokenVersion = userResult.value.getTokenVersion();
        await this.userFacade.updateUser(userId, {
            tokenVersion: tokenVersion + 1
        });
        return Result.ok();
    }
}
