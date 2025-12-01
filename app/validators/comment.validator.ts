import { ValidationError } from "../types/errors";

export type CommentInput = {
	postIdStr: string;
	nickname: string;
	content: string;
	ipAddress?: string | null;
	sessionId?: string | null;
};

export type ValidatedCommentInput = {
	postId: number;
	nickname: string;
	content: string;
	ipAddress?: string | null;
	sessionId?: string | null;
};

export function validateCommentInput(
	input: CommentInput,
): ValidatedCommentInput {
	const errors: string[] = [];

	// PostID検証
	const postId = Number.parseInt(input.postIdStr, 10);
	if (!input.postIdStr || Number.isNaN(postId)) {
		errors.push("記事IDが不正です");
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
		postId,
		nickname: input.nickname,
		content: input.content,
		ipAddress: input.ipAddress,
		sessionId: input.sessionId,
	};
}
