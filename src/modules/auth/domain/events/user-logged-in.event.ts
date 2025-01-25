export class UserLoggedInEvent {
    constructor(
        public readonly userId: number,
        public readonly loggedInAt: Date = new Date(),
    ) { }
}