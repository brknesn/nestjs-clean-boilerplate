import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByEmailQuery } from '../queries/get-user-by-email.query';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
    constructor(private readonly userRepo: UserRepository) { }

    async execute(query: GetUserByEmailQuery): Promise<any> {
        const { email } = query;
        return this.userRepo.findByEmail(email);
    }
}