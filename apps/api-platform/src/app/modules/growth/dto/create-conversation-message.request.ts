import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ConversationMessageDirection } from '@saas-platform/growth-domain';

const conversationDirections: ConversationMessageDirection[] = [
  'inbound',
  'outbound',
  'internal',
];

export class CreateConversationMessageRequestDto {
  @IsIn(conversationDirections)
  direction!: ConversationMessageDirection;

  @IsString()
  @MaxLength(4000)
  body!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  externalMessageId?: string | null;
}
