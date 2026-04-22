import { IsEmail } from 'class-validator';

export class InviteUserRequestDto {
  @IsEmail()
  email!: string;
}
