import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { ACCESS_SECRET } from '../constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: ACCESS_SECRET,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
