import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/use-cases/commands/create-user.command';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UserController {
    constructor(private readonly commandBus: CommandBus) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createUser(@Body() dto: CreateUserDto) {
        return this.commandBus.execute(new CreateUserCommand(dto));
    }
}