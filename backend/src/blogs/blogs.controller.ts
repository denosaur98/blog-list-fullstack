import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlog } from './dto/create-blog.dto';
import { UpdateBlog } from './dto/update-blog.dto';
import { Comment } from './dto/comment.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async allBlogs() {
    return await this.blogsService.allBlogs()
  }

  @Post()
  async createBlog(@Body() blog: CreateBlog) {
    return await this.blogsService.createBlog(blog)
  }

  @Patch('/:id')
  async updateBlog(@Param('id') blogId: string, @Body() blog: UpdateBlog) {
    return await this.blogsService.updateBlog(blogId, blog)
  }

  @Post(':id/comments')
  async addComment(@Param('id') blogId: string, @Body() comment: Comment) {
    return await this.blogsService.addComment(blogId, comment)
  }

  @Delete('/:id')
  async deleteBlog(@Param('id') blogId: string) {
    return await this.blogsService.deleteBlog(blogId)
  }
}