import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../commands/register.command';
import { UserFacade } from '../../../../user/application/facades/user.facade';
import { EmailVO } from '../../../../auth/domain/value-objects/email.vo';
import { PasswordVO } from '../../../../auth/domain/value-objects/password.vo';
import { PhoneVO } from '../../../../auth/domain/value-objects/phone.vo';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
    constructor(
        private readonly userFacade: UserFacade,
    ) { }

    async execute(command: RegisterCommand) {
        const { dto } = command;

        const phoneVO = new PhoneVO(dto.phone);
        const emailVO = new EmailVO(dto.email);
        const passwordVO = new PasswordVO(dto.password);

        const user = await this.userFacade.createUser({
            email: emailVO.value,
            password: passwordVO.value,
            name: dto.name,
            phone: phoneVO.value,
            stripeId: null,
            tokenVersion: 0,
        });

        return user;
    }
}