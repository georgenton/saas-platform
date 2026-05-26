import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAiMemoryRecordRequestDto {
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

  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  summary?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  detail?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tags?: string[] | null;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive' | null;
}
