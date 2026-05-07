import { IsOptional, IsString, MinLength } from 'class-validator';

export class SubmitPresignedInvoiceElectronicDocumentRequestDto {
  @IsString()
  @MinLength(1)
  signedXml!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  signerName?: string | null;
}
