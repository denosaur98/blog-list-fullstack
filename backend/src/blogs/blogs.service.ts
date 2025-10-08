import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'utils/prisma.service';
import { CreateBlog } from './dto/create-blog.dto';
import { UpdateBlog } from './dto/update-blog.dto';
import { Comment } from './dto/comment.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async allBlogs() {
    return await this.prisma.blog.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  async createBlog(userId: string, blog: CreateBlog) {
    const existingBlog = await this.prisma.blog.findFirst({
      where: {
        title: blog.title
      }
    });
    if(existingBlog) {
      throw new BadRequestException({ message: 'Блог с таким названием уже существует' });
    }

    return this.prisma.blog.create({
      data: {
        title: blog.title,
        description: blog.description,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  }

  async updateBlog(userId: string, blogId: string, blog: UpdateBlog) {
    const existingBlog = await this.prisma.blog.findUnique({
      where: { id: blogId }
    });
    if(!existingBlog) {
      throw new BadRequestException('Блог не найден');
    }

    if(existingBlog.authorId === userId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      })
      if(user?.role !== 'ADMIN') throw new BadRequestException({ message: 'Вы можете редактировать только свои блоги' })
    }

    return this.prisma.blog.update({
      where: { id: blogId },
      data: {
        title: blog.title,
        description: blog.description
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  }

  async addComment(userId: string, blogId: string, comment: Comment) {
    const existingBlog = await this.prisma.blog.findUnique({
      where: {
        id: blogId
      }
    })
    if(!existingBlog) {
      throw new BadRequestException('Блог не найден')
    }

    
    return this.prisma.comment.create({
      data: {
        text: comment.text,
        authorId: userId,
        blogId: blogId
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        blog: true
      }
    })
  }

  async deleteBlog(userId: string, blogId: string) {
    const existingBlog = await this.prisma.blog.findUnique({
      where: { id: blogId }
    });
    if(!existingBlog) {
      throw new BadRequestException('Блог не найден');
    }

    if(existingBlog.authorId !== userId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      })

      if(user?.role !== 'ADMIN') throw new BadRequestException({ message: 'Вы можете удалять только свои блоги' })
    }

    return this.prisma.blog.delete({
      where: { id: blogId }
    });
  }
}