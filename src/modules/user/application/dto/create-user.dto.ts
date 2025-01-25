import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly phone: string;

    @IsOptional()
    readonly stripeId?: string;

    @IsOptional()
    readonly tokenVersion?: number;
}