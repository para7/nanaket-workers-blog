import type { IRepositories } from "../repositories";
// import { commentsUsecase, type ICommentsUsecase } from "./comments.usecase";
import { type IPostsUsecase, postsUsecase } from "./posts.usecase";

// すべてのUsecaseをまとめるインターフェース
export interface IUsecases {
	posts: IPostsUsecase;
	// comments: ICommentsUsecase;
}

// Usecasesファクトリ関数
export const usecases = (repositories: IRepositories): IUsecases => ({
	posts: postsUsecase(repositories),
	// comments: commentsUsecase(repositories),
});
