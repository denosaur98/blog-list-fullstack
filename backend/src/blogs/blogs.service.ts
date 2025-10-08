import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'utils/prisma.service';
import { CreateBlog } from './dto/create-blog.dto';
import { UpdateBlog } from './dto/update-blog.dto';
import { Comment } from './dto/comment.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async allBlogs() {
    return await this.prisma.blog.findMany({
      include: {
        author: true,
        comments: {
          include: {
            author: true
          }
        }
      }
    });
  }

  async createBlog(blog: CreateBlog) {
    const existingBlog = await this.prisma.blog.findFirst({
      where: {
        title: blog.title
      }
    });

    if(existingBlog) {
      throw new BadRequestException({ message: 'Блог с таким названием уже существует' });
    }

    const hashedPassword = await bcrypt.hash(blog.author.password, 10)

    return this.prisma.blog.create({
      data: {
        title: blog.title,
        description: blog.description,
        author: {
          connectOrCreate: {
            where: { email: blog.author.email },
            create: {
              email: blog.author.email,
              name: blog.author.name,
              password: hashedPassword
            }
          }
        }
      },
      include: {
        author: true
      }
    });
  }

  async updateBlog(blogId: string, blog: UpdateBlog) {
    const existingBlog = await this.prisma.blog.findUnique({
      where: { id: blogId }
    });

    if(!existingBlog) {
      throw new BadRequestException('Блог не найден');
    }

    return this.prisma.blog.update({
      where: { id: blogId },
      data: {
        title: blog.title,
        description: blog.description
      },
      include: {
        author: true
      }
    });
  }

  async addComment(blogId: string, comment: Comment) {
    const existingBlog = await this.prisma.blog.findUnique({
      where: {
        id: blogId
      }
    })

    if(!existingBlog) {
      throw new BadRequestException('Блог не найден')
    }

    const hashedPassword = await bcrypt.hash(comment.author.password, 10)
    
    return this.prisma.comment.create({
      data: {
        text: comment.text,
        author: {
          connectOrCreate: {
            where: { email: comment.author.email },
            create: {
              email: comment.author.email,
              name: comment.author.name,
              password: hashedPassword
            }
          }
        },
        blog: {
          connect: {
            id: blogId
          }
        }
      },
      include: {
        author: true,
        blog: true
      }
    })
  }

  async deleteBlog(blogId: string) {
    const existingBlog = await this.prisma.blog.findUnique({
      where: { id: blogId }
    });

    if(!existingBlog) {
      throw new BadRequestException('Блог не найден');
    }

    return this.prisma.blog.delete({
      where: { id: blogId }
    });
  }
}