import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from '../../application/dto/login.dto';
import { RegisterDto } from '../../application/dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthFacade } from '../../application/facades/auth.facade';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authFacade: AuthFacade,
    ) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authFacade.login(dto.email, dto.password);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authFacade.register(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getCurrentUser(@Req() req: any) {
        return this.authFacade.getCurrentUser(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: any) {
        return this.authFacade.logout(req.user.userId);
    }
}