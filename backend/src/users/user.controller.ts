import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('find/:did')
  async findOne(@Param('did') did: string) {
    return await this.userService.findOne(did);
  }

  @Post('edit')
  async update(@Req() req: Request, @Body() userDto: UserDto) {
    return await this.userService.update(req, userDto);
  }

  @Get('bookmark')
  async findBookmarks(@Req() req: Request) {
    return await this.userService.findBookmarks(req);
  }

  @Post('bookmark/:postId')
  async addBookmark(@Req() req: Request, @Param('postId') postId: string) {
    return await this.userService.addBookmark(req, postId);
  }

  @Post('remove-bookmark/:postId')
  async removeBookmark(@Req() req: Request, @Param('postId') postId: string) {
    return await this.userService.removeBookmark(req, postId);
  }

  @Post('follow/:userId')
  async follow(@Req() req: Request, @Param('userId') userId: string) {
    return await this.userService.follow(req, userId);
  }

  @Post('unfollow/:userId')
  async unfollow(@Req() req: Request, @Param('userId') userId: string) {
    return await this.userService.unfollow(req, userId);
  }
}
