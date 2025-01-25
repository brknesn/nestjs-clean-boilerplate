import { HttpException, HttpStatus } from "@nestjs/common";

export class EmailVO {
    private readonly _value: string;

    constructor(email: string) {
        this.validate(email);
        this._value = email;
    }

    private validate(email: string): void {
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
        }
    }

    public get value(): string {
        return this._value;
    }
}