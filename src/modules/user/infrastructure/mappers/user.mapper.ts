import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../../application/dto/update-user.dto';

@Injectable()
export class UserMapper {
    toDomain(prismaUser: PrismaUser): User {
        return new User(
            prismaUser.email,
            prismaUser.password,
            prismaUser.name,
            prismaUser.stripeId,
            prismaUser.phone,
            prismaUser.id,
            prismaUser.tokenVersion,
        );
    }

    toPersistence(user: UpdateUserDto): Partial<PrismaUser> {
        return {
            email: user.email,
            name: user.name,
            phone: user.phone,
            stripeId: user.stripeId,
            tokenVersion: user.tokenVersion,
        };
    }
}