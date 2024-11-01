import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWtPayload } from './dto/payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { ACCESS_SECRET } from 'src/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: ACCESS_SECRET,
    });
  }

  async validate(payload: JWtPayload) {
    const user = await this.userModel.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { _id: user._id };
  }
}
