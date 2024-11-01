import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostDto } from './dto/post.dto';
import { Comment } from './schemas/post.schema';
import { UserPostDto } from './dto/user-post-dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Post('user')
  async findAllUsers(@Query() query: UserPostDto) {
    return await this.postService.findAllUsers(query);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return await this.postService.findByUser(userId);
  }

  @Post()
  async createPost(@Req() req: Request, @Body() post: PostDto) {
    return await this.postService.createPost(req, post);
  }

  @Post('edit/:postId')
  async editPost(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body() post: PostDto,
  ) {
    return await this.postService.editPost(req, postId, post);
  }

  @Post('delete/:postId')
  async delete(@Param('postId') postId: string) {
    return await this.postService.deletePost(postId);
  }

  @Post('like/:postId')
  async likePost(@Req() req: Request, @Param('postId') postId: string) {
    return await this.postService.likePost(req, postId);
  }

  @Post('dislike/:postId')
  async dislikePost(@Req() req: Request, @Param('postId') postId: string) {
    return await this.postService.dislikePost(req, postId);
  }

  @Get('comments/:postId')
  async findPostComments(@Param('postId') postId: string) {
    return await this.postService.findPostComments(postId);
  }

  @Post('comments/add/:postId')
  async addComment(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body() comment: Comment,
  ) {
    return await this.postService.addComment(req, postId, comment);
  }

  @Post('comments/edit/:postId')
  async editComment(@Param('postId') postId: string, @Body() update: Comment) {
    return await this.postService.editComment(postId, update);
  }

  @Post('comments/delete/:postId')
  async deleteComment(
    @Param('postId') postId: string,
    @Body() remove: Comment,
  ) {
    return await this.postService.deleteComment(postId, remove);
  }
}
