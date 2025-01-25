import { HttpException, HttpStatus } from "@nestjs/common";

export class PasswordVO {
    private readonly _value: string;

    constructor(hashedPassword: string) {
        this.validate(hashedPassword);
        this._value = hashedPassword;
    }

    private validate(password: string): void {
        if (!password || !password.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            throw new HttpException('Password must be at least 8 characters long and contain at least one alphanumeric character', HttpStatus.BAD_REQUEST);
        }
    }

    public get value(): string {
        return this._value;
    }
}