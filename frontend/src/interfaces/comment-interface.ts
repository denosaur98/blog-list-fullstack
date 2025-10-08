import type { AuthorInterface } from './author-interface';

export interface CommentInterface {
  text: string
  author: AuthorInterface
}