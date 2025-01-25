import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../use-cases/commands/login.command';
import { RegisterCommand } from '../use-cases/commands/register.command';
import { LogoutCommand } from '../use-cases/commands/logout.command';
import { UserFacade } from '../../../user/application/facades/user.facade';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthFacade {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userFacade: UserFacade,
    ) { }

    async login(email: string, password: string) {
        return this.commandBus.execute(new LoginCommand(email, password));
    }

    async register(dto: RegisterDto) {
        return this.commandBus.execute(
            new RegisterCommand(dto),
        );
    }

    async getCurrentUser(userId: number) {
        return this.userFacade.findUserById(userId);
    }

    async logout(userId: number) {
        return this.commandBus.execute(new LogoutCommand(userId));
    }
}
