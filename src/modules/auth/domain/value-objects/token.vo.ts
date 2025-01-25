export class TokenVO {
    constructor(
        private readonly _accessToken: string,
        private readonly _expiresIn: number,
    ) {
        if (!_accessToken) {
            throw new Error('Token cannot be empty');
        }
        if (_expiresIn <= 0) {
            throw new Error('Token expiry must be positive');
        }
    }

    get accessToken(): string {
        return this._accessToken;
    }

    get expiresIn(): number {
        return this._expiresIn;
    }

}