import type { UserInterface } from './user-interface';

export interface BlogInterface {
  id?: string
  title: string
  description: string
  author?: UserInterface
}