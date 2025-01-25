import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { JwtService } from '@nestjs/jwt';
import { Result } from '../../../../../shared/domain/result';
import { UserFacade } from '../../../../user/application/facades/user.facade';
import * as moment from 'moment';
type LoginResponse = {
    accessToken: string;
    expiresIn: Date;
};

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, Result<LoginResponse>> {
    constructor(
        private readonly userFacade: UserFacade,
        private readonly jwtService: JwtService,
    ) { }

    async execute(command: LoginCommand): Promise<Result<LoginResponse>> {
        const { email, password } = command;
        const user = await this.userFacade.findUserByEmail(email);

        if (user.isFailure) {
            return Result.fail<LoginResponse>(user.error);
        }

        const userJson = user.value.toJSON();
        const isMatch = await this.userFacade.comparePassword(password, user.value.getPassword());
        if (!isMatch) {
            return Result.fail<LoginResponse>('Invalid credentials');
        }
        const tokenVersion = user.value.getTokenVersion();
        const payload = {
            sub: userJson.id,
            stripe_id: userJson.stripe_id,
            email: userJson.email,
            phone: userJson.phone,
            name: userJson.name,
            tokenVersion: tokenVersion,
        };

        const accessToken = this.jwtService.sign(payload);

        return Result.ok({
            accessToken,
            expiresIn: moment().add("7", "days").toDate(),
        });
    }
}