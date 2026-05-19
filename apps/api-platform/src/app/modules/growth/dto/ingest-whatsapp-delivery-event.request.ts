import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ConversationMessageDeliveryStatus } from '@saas-platform/growth-domain';

const deliveryStatuses: ConversationMessageDeliveryStatus[] = [
  'pending',
  'sent',
  'delivered',
  'read',
  'failed',
];

export class IngestWhatsappDeliveryEventRequestDto {
  @IsString()
  @MaxLength(200)
  externalMessageId!: string;

  @IsIn(deliveryStatuses)
  deliveryStatus!: ConversationMessageDeliveryStatus;

  @IsOptional()
  @IsIn(['meta_cloud_api_stub', 'meta_cloud_api'])
  provider?: 'meta_cloud_api_stub' | 'meta_cloud_api';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  providerEventId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  eventKey?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  failureReason?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  providerStatusDetail?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  providerConversationCategory?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  providerPricingCategory?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  providerErrorCode?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  payloadJson?: string | null;

  @IsOptional()
  @IsDateString()
  occurredAt?: string | null;
}
