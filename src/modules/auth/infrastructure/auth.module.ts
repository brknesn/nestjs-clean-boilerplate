import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginHandler } from '../application/use-cases/handlers/login.handler';
import { RegisterHandler } from '../application/use-cases/handlers/register.handler';
import { LogoutHandler } from '../application/use-cases/handlers/logout.handler';
import { AuthFacade } from '../application/facades/auth.facade';
import { UserModule } from '../../user/infrastructure/user.module';
@Module({
    imports: [
        CqrsModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get<string>('appConfig.jwt.secret') || 'myjwtsecret',
                    signOptions: { expiresIn: config.get<string>('appConfig.jwt.expiresIn') || '7d' },
                }
            },
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthFacade,
        JwtStrategy,
        // Handlers
        LoginHandler,
        RegisterHandler,
        LogoutHandler,
    ],
    exports: [],
})
export class AuthModule { }