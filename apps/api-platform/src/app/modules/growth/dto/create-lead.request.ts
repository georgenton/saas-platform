import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { LeadStatus } from '@saas-platform/growth-domain';

const leadStatuses: LeadStatus[] = [
  'captured',
  'contacted',
  'qualified',
  'disqualified',
  'converted',
];

export class CreateLeadRequestDto {
  @IsString()
  @MaxLength(160)
  fullName!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phoneE164?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  whatsappE164?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  source?: string | null;

  @IsOptional()
  @IsIn(leadStatuses)
  status?: LeadStatus | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;
}
