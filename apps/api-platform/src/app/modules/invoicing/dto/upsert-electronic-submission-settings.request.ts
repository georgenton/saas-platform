import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpsertElectronicSubmissionSettingsRequestDto {
  @IsOptional()
  @IsIn(['stub_sri', 'sri_offline_ws'])
  provider?: 'stub_sri' | 'sri_offline_ws';

  @IsOptional()
  @IsIn(['test', 'production'])
  environment?: 'test' | 'production';

  @IsOptional()
  @IsIn(['sync_stub', 'offline'])
  transmissionMode?: 'sync_stub' | 'offline';

  @IsOptional()
  @IsString()
  @MinLength(1)
  receptionUrl?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  authorizationUrl?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  credentialsSecretRef?: string | null;

  @IsInt()
  @Min(1000)
  timeoutMs!: number;

  @IsBoolean()
  isActive!: boolean;
}
