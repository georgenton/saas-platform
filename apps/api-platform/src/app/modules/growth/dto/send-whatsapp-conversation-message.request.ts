import {
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class SendWhatsappConversationMessageRequestDto {
  @ValidateIf((object) => !object.templateId)
  @IsString()
  @MaxLength(4000)
  body?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  templateId?: string | null;

  @IsOptional()
  @IsObject()
  templateVariables?: Record<string, string | number | boolean | null> | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  outboundIntentKey?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  externalMessageId?: string | null;

  @IsOptional()
  @IsDateString()
  occurredAt?: string | null;
}
