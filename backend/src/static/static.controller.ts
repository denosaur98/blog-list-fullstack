import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller('uploads')
export class StaticController {
  @Get('users/:filename')
  serveAvatar(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'users', filename)
    return res.sendFile(filePath)
  }
}