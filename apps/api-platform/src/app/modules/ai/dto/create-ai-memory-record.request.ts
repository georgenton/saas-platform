import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAiMemoryRecordRequestDto {
  @IsIn(['tenant', 'domain', 'agent'])
  scope!: 'tenant' | 'domain' | 'agent';

  @IsOptional()
  @IsIn(['growth', 'invoicing', 'ecommerce'])
  domainKey?: 'growth' | 'invoicing' | 'ecommerce' | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  agentKey?: string | null;

  @IsOptional()
  @IsIn(['operator_note', 'approval_memory', 'guarded_execution_memory'])
  sourceKind?:
    | 'operator_note'
    | 'approval_memory'
    | 'guarded_execution_memory'
    | null;

  @IsOptional()
  @IsIn(['working_memory', 'durable_memory'])
  freshness?: 'working_memory' | 'durable_memory' | null;

  @IsString()
  @MaxLength(120)
  title!: string;

  @IsString()
  @MaxLength(280)
  summary!: string;

  @IsString()
  @MaxLength(2000)
  detail!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags?: string[] | null;
}
