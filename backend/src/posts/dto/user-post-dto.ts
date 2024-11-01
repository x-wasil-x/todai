import { IsNumberString, IsString } from 'class-validator';

export class UserPostDto {
  @IsString()
  did: string;

  @IsNumberString()
  skip: string;

  @IsNumberString()
  limit: string;
}
