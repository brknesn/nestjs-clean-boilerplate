import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserFacade } from "../../../user/application/facades/user.facade";
interface JwtPayload {
    sub: number;
    tokenVersion: number;
}

interface UserPayload {
    userId: number;
    email: string;
    name: string;
    phone: string;
    tokenVersion: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userFacade: UserFacade,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>("appConfig.jwt.secret") || "myjwtsecret",
        });
    }

    /**
     * Validates the JWT payload and returns user information
     * @param payload - The decoded JWT payload
     * @throws UnauthorizedException if token is invalid or user not found
     */
    async validate(payload: JwtPayload): Promise<UserPayload> {
        if (!payload?.sub || typeof payload.tokenVersion !== "number") {
            throw new UnauthorizedException("Invalid token payload");
        }

        const userResult = await this.userFacade.findUserById(payload.sub);
        if (userResult.isFailure) {
            throw new UnauthorizedException("Invalid token");
        }

        const userJson = userResult.value.toJSON();
        const tokenVersion = userResult.value.getTokenVersion();
        if (tokenVersion !== payload.tokenVersion) {
            throw new UnauthorizedException("Invalid token");
        }
        return {
            userId: userJson.id,
            email: userJson.email,
            name: userJson.name,
            phone: userJson.phone,
            tokenVersion: tokenVersion,
        };
    }
}