// カスタムエラークラス
export class ValidationError extends Error {
	constructor(public errors: string[]) {
		super(errors.join(", "));
		this.name = "ValidationError";
	}
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
	}
}
