import { ValidationError } from "../types/errors";

export type CommentInput = {
	postSlugStr: string;
	nickname: string;
	content: string;
	ipAddress?: string | null;
	sessionId?: string | null;
};

export type ValidatedCommentInput = {
	postSlug: string;
	nickname: string;
	content: string;
	ipAddress?: string | null;
	sessionId?: string | null;
};

export function validateCommentInput(
	input: CommentInput,
): ValidatedCommentInput {
	const errors: string[] = [];

	// PostSlug検証
	if (!input.postSlugStr || typeof input.postSlugStr !== "string") {
		errors.push("記事スラッグが不正です");
	} else if (!/^[a-z0-9-_]+$/.test(input.postSlugStr)) {
		errors.push("記事スラッグの形式が不正です");
	}

	// Nickname検証
	if (!input.nickname || typeof input.nickname !== "string") {
		errors.push("ニックネームは必須です");
	} else if (input.nickname.length < 1 || input.nickname.length > 50) {
		errors.push("ニックネームは1-50文字で入力してください");
	}

	// Content検証
	if (!input.content || typeof input.content !== "string") {
		errors.push("コメント内容は必須です");
	} else if (input.content.length < 1 || input.content.length > 1000) {
		errors.push("コメント内容は1-1000文字で入力してください");
	}

	if (errors.length > 0) {
		throw new ValidationError(errors);
	}

	return {
		postSlug: input.postSlugStr,
		nickname: input.nickname,
		content: input.content,
		ipAddress: input.ipAddress,
		sessionId: input.sessionId,
	};
}
