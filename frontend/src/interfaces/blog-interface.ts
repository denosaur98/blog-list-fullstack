import type { AuthorInterface } from './author-interface';

export interface BlogInterface {
  id?: string
  title: string
  description: string
  author?: AuthorInterface
}