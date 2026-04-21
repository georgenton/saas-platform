import { IsNotEmpty, IsString } from 'class-validator';

export class AssignMembershipRoleRequestDto {
  @IsString()
  @IsNotEmpty()
  roleKey!: string;
}
