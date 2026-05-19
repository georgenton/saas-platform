import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  ConversationChannel,
  ConversationThreadStatus,
} from '@saas-platform/growth-domain';

const conversationChannels: ConversationChannel[] = ['manual', 'whatsapp'];
const conversationStatuses: ConversationThreadStatus[] = ['open', 'closed'];

export class CreateConversationThreadRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  leadId?: string | null;

  @IsString()
  @MaxLength(160)
  subject!: string;

  @IsOptional()
  @IsIn(conversationChannels)
  channel?: ConversationChannel | null;

  @IsOptional()
  @IsIn(conversationStatuses)
  status?: ConversationThreadStatus | null;
}
