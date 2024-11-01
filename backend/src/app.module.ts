import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MONGO_DB } from './constants';
import { PostModule } from './posts/post.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: MONGO_DB,
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
