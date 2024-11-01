import { IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  did: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  avatarURL?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  website?: string;
}
