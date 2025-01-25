import { Module } from "@nestjs/common";
import { AuthModule } from "./auth";
import { UserModule } from "./user/infrastructure/user.module";

@Module({
    imports: [
        AuthModule,
        UserModule
    ],
})
export class DomainModule { }