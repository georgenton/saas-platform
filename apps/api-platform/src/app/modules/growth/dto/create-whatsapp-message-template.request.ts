import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  WhatsappMessageTemplateCategory,
  WhatsappMessageTemplateProviderApprovalStatus,
} from '@saas-platform/growth-domain';

const templateCategories: WhatsappMessageTemplateCategory[] = [
  'utility',
  'marketing',
  'authentication',
];
const providerApprovalStatuses: WhatsappMessageTemplateProviderApprovalStatus[] =
  ['draft', 'pending_review', 'approved', 'rejected'];

export class CreateWhatsappMessageTemplateRequestDto {
  @IsString()
  @MaxLength(80)
  key!: string;

  @IsString()
  @MaxLength(160)
  name!: string;

  @IsString()
  @MaxLength(16)
  languageCode!: string;

  @IsIn(templateCategories)
  category!: WhatsappMessageTemplateCategory;

  @IsString()
  @MaxLength(4000)
  bodyTemplate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  intentKey?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  providerTemplateName?: string | null;

  @IsOptional()
  @IsIn(providerApprovalStatuses)
  providerApprovalStatus?: WhatsappMessageTemplateProviderApprovalStatus | null;
}
