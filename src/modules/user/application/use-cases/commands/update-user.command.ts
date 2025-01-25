import { UpdateUserDto } from "../../dto/update-user.dto";

export class UpdateUserCommand {
    constructor(public readonly id: number, public readonly user: UpdateUserDto) { }
}