import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlog } from './dto/create-blog.dto';
import { UpdateBlog } from './dto/update-blog.dto';
import { Comment } from './dto/comment.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async allBlogs() {
    return await this.blogsService.allBlogs()
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBlog(@GetUser() userId: any, @Body() blog: CreateBlog) {
    return await this.blogsService.createBlog(userId.id, blog)
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateBlog(@GetUser() userId: any, @Param('id') blogId: string, @Body() blog: UpdateBlog) {
    return await this.blogsService.updateBlog(userId.id, blogId, blog)
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(@GetUser() userId: any, @Param('id') blogId: string, @Body() comment: Comment) {
    return await this.blogsService.addComment(userId.id, blogId, comment)
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBlog(@GetUser() userId: any, @Param('id') blogId: string) {
    return await this.blogsService.deleteBlog(userId.id, blogId)
  }
}