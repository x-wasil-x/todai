import { IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsOptional()
  username?: string;

  @IsString()
  did: string;
}
