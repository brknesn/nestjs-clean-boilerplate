export class User {
    private readonly id?: number;
    private readonly email: string;
    private readonly password: string;
    private readonly name: string;
    private readonly phone: string;
    private readonly stripe_id: string;
    private readonly tokenVersion: number;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;

    constructor(
        email: string,
        password: string,
        name: string,
        stripe_id: string,
        phone: string,
        id?: number,
        tokenVersion = 0,
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.stripe_id = stripe_id;
        this.tokenVersion = tokenVersion;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    public toJSON() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            phone: this.phone,
            stripe_id: this.stripe_id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }

    public getPassword(): string {
        return this.password;
    }

    public getTokenVersion(): number {
        return this.tokenVersion;
    }
}
