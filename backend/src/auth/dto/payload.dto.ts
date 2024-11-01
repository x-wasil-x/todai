import { IsString } from 'class-validator';

export class JWtPayload {
  @IsString()
  sub: string;
}
