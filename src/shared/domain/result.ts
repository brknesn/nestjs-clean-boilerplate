export class Result<T> {
    private readonly _isSuccess: boolean;
    private readonly _error: string;
    private readonly _value: T;

    private constructor(isSuccess: boolean, error?: string, value?: T) {
        this._isSuccess = isSuccess;
        this._error = error;
        this._value = value;

        Object.freeze(this);
    }

    public get isSuccess(): boolean {
        return this._isSuccess;
    }

    public get isFailure(): boolean {
        return !this._isSuccess;
    }

    public get error(): string {
        if (this._isSuccess) {
            throw new Error('Cannot get error from success Result');
        }
        return this._error;
    }

    public get value(): T {
        if (!this._isSuccess) {
            throw new Error('Cannot get value from failure Result');
        }
        return this._value;
    }

    public static ok<U>(value?: U): Result<U> {
        return new Result<U>(true, null, value);
    }

    public static fail<U>(error: string): Result<U> {
        return new Result<U>(false, error);
    }
}