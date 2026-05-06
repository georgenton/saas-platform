import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpsertElectronicSignatureSettingsRequestDto {
  @IsOptional()
  @IsIn(['stub_local', 'xades_pkcs12'])
  provider?: 'stub_local' | 'xades_pkcs12';

  @IsString()
  @MinLength(1)
  certificateLabel!: string;

  @IsOptional()
  @IsIn(['stub_inline', 'secret_ref'])
  storageMode?: 'stub_inline' | 'secret_ref';

  @IsOptional()
  @IsString()
  @MinLength(1)
  certificateFingerprint?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  pkcs12SecretRef?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  privateKeyPasswordSecretRef?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  subjectName?: string | null;

  @IsBoolean()
  isActive!: boolean;
}
