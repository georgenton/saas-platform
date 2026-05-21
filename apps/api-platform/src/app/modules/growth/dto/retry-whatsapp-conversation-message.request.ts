import { IsDateString, IsOptional } from 'class-validator';

export class RetryWhatsappConversationMessageRequestDto {
  @IsOptional()
  @IsDateString()
  occurredAt?: string | null;
}
