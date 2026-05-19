import { IngestTenantWhatsappConversationMessageResult } from '@saas-platform/growth-application';
import {
  ConversationMessageResponseDto,
  toConversationMessageResponseDto,
} from './conversation-message.response';
import {
  ConversationThreadResponseDto,
  toConversationThreadResponseDto,
} from './conversation-thread.response';

export interface IngestedWhatsappConversationMessageResponseDto {
  createdThread: boolean;
  thread: ConversationThreadResponseDto;
  message: ConversationMessageResponseDto;
}

export const toIngestedWhatsappConversationMessageResponseDto = (
  result: IngestTenantWhatsappConversationMessageResult,
): IngestedWhatsappConversationMessageResponseDto => ({
  createdThread: result.createdThread,
  thread: toConversationThreadResponseDto(result.thread),
  message: toConversationMessageResponseDto(result.message),
});
