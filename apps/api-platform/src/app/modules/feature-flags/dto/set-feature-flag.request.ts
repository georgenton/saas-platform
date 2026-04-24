import { IsBoolean } from 'class-validator';

export class SetFeatureFlagRequestDto {
  @IsBoolean()
  enabled!: boolean;
}
