import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'utils/prisma.service';
import { FileUploadService } from 'utils/file-upload.service';
import { Register } from './dto/register.dto';
import { Login } from './dto/login.dto';
import { UpdateUser } from './dto/update-user.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private fileUploadService: FileUploadService
  ) {}

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

  async updateUser(userId: string, user: UpdateUser) {
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

    let emailToUpdate: string
    if(!user.email || user.email.trim() === '') {
      emailToUpdate = existingUser.email
    } else {
      emailToUpdate = user.email
    }

    let nameToUpdate: string | null = user.name || existingUser.name
    if(!user.name || user.name.trim() === '') {
      nameToUpdate = existingUser.name
    } else {
      nameToUpdate = user.name
    }

    let passwordToUpdate: string
    if (!user.password || user.password.trim() === '') {
      passwordToUpdate = existingUser.password
    } else {
      passwordToUpdate = await bcrypt.hash(user.password, 10)
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        email: emailToUpdate,
        name: nameToUpdate,
        password: passwordToUpdate
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

  async updateAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user) throw new BadRequestException({ message: 'Пользователь с таким id не найден' })

    if(user.avatar) {
      const oldAvatarPath = this.fileUploadService.getImagePath(user.avatar.split('/').pop() || '')
      if(existsSync(oldAvatarPath)) {
        unlinkSync(oldAvatarPath)
      }
    }

    const avatarUrl = this.fileUploadService.getImageUrl(file.filename)
    const updateUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatar: avatarUrl
      }
    })

    return {
      avatar: updateUser.avatar,
      message: 'Аватарка успешно обновлена'
    }
  }

  async deleteAvatar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) throw new BadRequestException({ message: 'Пользователь с таким id не найден' })
    if(!user.avatar) throw new BadRequestException({ message: 'Аватарка не найдена' })

    const avatarPath = this.fileUploadService.getImagePath(user.avatar.split('/').pop() || '')
    if(existsSync(avatarPath)) {
      unlinkSync(avatarPath)
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        avatar: null
      }
    })

    return {
      message: 'Аватарка успешно удалена'
    }
  }
}
