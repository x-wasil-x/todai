import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
// import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
// import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
