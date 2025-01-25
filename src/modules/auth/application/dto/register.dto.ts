import { IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase().trim())
    readonly email: string;

    @IsString() // veya başka şarta göre
    @Transform(({ value }) => value.trim())
    readonly password: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    readonly name: string;

    @IsString()
    @Transform(({ value }) => value.replace(/\s+/g, ''))
    readonly phone: string;
}