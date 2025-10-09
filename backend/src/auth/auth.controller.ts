import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Register } from './dto/register.dto';
import { Login } from './dto/login.dto';
import { UpdateUser } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async allUsers() {
    return await this.authService.allUsers()
  }

  @Post('register')
  async register(@Body() user: Register) {
    return await this.authService.register(user)
  }

  @Post('login')
  async login(@Body() user: Login) {
    return await this.authService.login(user)
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('id') userId: string, @Body() user: UpdateUser) {
    return await this.authService.updateUser(userId, user)
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') userId: string) {
    return await this.authService.deleteUser(userId)
  }
}
