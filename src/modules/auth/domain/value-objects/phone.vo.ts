import { HttpException, HttpStatus } from "@nestjs/common";

export class PhoneVO {
    private readonly _value: string;

    constructor(phone: string) {
        this.validate(phone);
        this._value = phone;
    }

    private validate(phone: string): void {
        if (!phone || !phone.match(/^\+[1-9]\d{1,14}$/)) {
            throw new HttpException('Invalid phone number format', HttpStatus.BAD_REQUEST);
        }
    }

    public get value(): string {
        return this._value;
    }
}