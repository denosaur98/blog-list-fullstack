import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'utils/prisma.service';
import { Register } from './dto/register.dto';
import { Login } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async allUsers() {
    return await this.prisma.user.findMany()
  }

  async register(user: Register) {
    const uniqueUser = await this.prisma.user.findUnique({
      where: {
        email: user.email
      }
    })
    if(uniqueUser) throw new BadRequestException({ message: 'Пользователь с такой почтой уже существует' })

    const hashedPassword = await bcrypt.hash(user.password, 10)

    const newUser = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword
      }
    })

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name
    }

    return {
      access_token: this.jwtService.sign(payload),
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  }

  async login(user: Login) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: user.email
      }
    })
    if(!existingUser) throw new BadRequestException({ message: 'Пользователь с такой почтой не найден' })

    const isPasswordValid = await bcrypt.compare(user.password, existingUser.password)
    if(!isPasswordValid) throw new BadRequestException({ message: 'Некорректная почта или пароль' })

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      name: existingUser.name
    }

    return {
      access_token: this.jwtService.sign(payload),
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name
    }
  }

  async updateUser(userId: string, user: Register) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!existingUser) throw new BadRequestException({ message: 'Пользователь с таким id не найден' })
    
    if(user.email !== existingUser.email) {
      const userWithSameEmail = await this.prisma.user.findUnique({
        where: {
          email: user.email
        }
      })

      if(userWithSameEmail) throw new BadRequestException({ message: 'Пользователь с такой почтой уже существует' })
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)

    const updateUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword
      }
    })

    const payload = {
      sub: updateUser.id,
      email: updateUser.email,
      name: updateUser.name,
    }

    return {
      access_token: this.jwtService.sign(payload),
      userId: updateUser.id,
      email: updateUser.email,
      name: updateUser.name
    }
  }

  async deleteUser(userId: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!existingUser) throw new BadRequestException({ message: 'Пользователь с таким id не найден' })

    return await this.prisma.user.delete({
      where: {
        id: userId
      }
    })
  }
}
