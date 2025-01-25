import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(private readonly userRepo: UserRepository) { }

    async execute(query: GetUserByIdQuery): Promise<any> {
        const { userId } = query;
        return this.userRepo.findById(userId);
    }
}