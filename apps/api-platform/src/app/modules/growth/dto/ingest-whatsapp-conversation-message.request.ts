import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class IngestWhatsappConversationMessageRequestDto {
  @IsString()
  @MaxLength(200)
  externalConversationId!: string;

  @IsString()
  @MaxLength(64)
  participantHandle!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  participantDisplayName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  leadId?: string | null;

  @IsString()
  @MaxLength(4000)
  body!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  externalMessageId?: string | null;

  @IsOptional()
  @IsDateString()
  occurredAt?: string | null;
}
