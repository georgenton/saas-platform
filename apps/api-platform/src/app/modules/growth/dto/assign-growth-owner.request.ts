import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AssignGrowthOwnerRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  assigneeUserId?: string | null;
}
