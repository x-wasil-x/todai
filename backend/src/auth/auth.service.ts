import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(loginDto: LoginDto) {
    const { username, did } = loginDto;

    try {
      await new this.userModel({
        username,
        did,
      }).save();

      const user = await this.validateUser(loginDto);

      const payload = { sub: user._id };
      const token = this.jwtService.sign(payload);

      return { token, username: user.username, did: user.did };
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException();
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto);

      const payload = { sub: user._id };
      const token = this.jwtService.sign(payload);

      return { token, username: user.username, did: user.did };
    } catch (err) {
      console.log(err);

      throw new UnauthorizedException();
    }
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { did } = loginDto;

    const user = await this.userModel.findOne({ did: did });

    if (user) {
      return user;
    }

    throw new UnauthorizedException();
  }
}
