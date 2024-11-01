import { IsOptional, IsString, IsUrl } from 'class-validator';

export class PostDto {
  @IsString()
  username: string;

  @IsString()
  did: string;

  @IsString()
  content: string;

  @IsUrl()
  avatarURL: string;

  @IsOptional()
  mediaURL?: string;

  @IsOptional()
  type?: string;
}
