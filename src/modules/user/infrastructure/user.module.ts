import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from '../application/use-cases/handlers/create-user.handler';
import { UserRepository } from './repositories/user.repository';
import { UserFacade } from '../application/facades/user.facade';
import { GetUserByIdHandler } from '../application/use-cases/handlers/get-user-by-id.handler';
import { GetUserByEmailHandler } from '../application/use-cases/handlers/get-user-by-email.handler';
import { UpdateUserHandler } from '../application/use-cases/handlers/update-user.handler';
import { PrismaModule } from '../../../shared/infrastructure/prisma/prisma.module';
import { UserMapper } from './mappers/user.mapper';
import { PasswordHashService } from '../domain/services/password-hash.service';

@Module({
    imports: [
        CqrsModule,
        PrismaModule,
    ],
    controllers: [UserController],
    providers: [
        CreateUserHandler,
        UserRepository,
        UserFacade,
        UserMapper,
        PasswordHashService,
        GetUserByIdHandler,
        GetUserByEmailHandler,
        UpdateUserHandler,
    ],
    exports: [
        UserFacade,
        UserRepository,
        PasswordHashService,
    ],
})
export class UserModule { }