import { Injectable } from '@nestjs/common';
import {
  IssuerProfileRepository,
} from '@saas-platform/invoicing-application';
import {
  IssuerEmissionType,
  IssuerEnvironment,
  IssuerProfile,
} from '@saas-platform/invoicing-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaIssuerProfileRepository implements IssuerProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(profile: IssuerProfile): Promise<void> {
    const data = profile.toPrimitives();

    await this.prisma.issuerProfile.upsert({
      where: { tenantId: data.tenantId },
      update: {
        legalName: data.legalName,
        commercialName: data.commercialName,
        taxId: data.taxId,
        environment: data.environment,
        emissionType: data.emissionType,
        accountingObligated: data.accountingObligated,
        specialTaxpayerCode: data.specialTaxpayerCode,
        rimpeTaxpayerType: data.rimpeTaxpayerType,
        matrixAddress: data.matrixAddress,
        establishmentAddress: data.establishmentAddress,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        legalName: data.legalName,
        commercialName: data.commercialName,
        taxId: data.taxId,
        environment: data.environment,
        emissionType: data.emissionType,
        accountingObligated: data.accountingObligated,
        specialTaxpayerCode: data.specialTaxpayerCode,
        rimpeTaxpayerType: data.rimpeTaxpayerType,
        matrixAddress: data.matrixAddress,
        establishmentAddress: data.establishmentAddress,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<IssuerProfile | null> {
    const record = await this.prisma.issuerProfile.findUnique({
      where: { tenantId },
    });

    return record ? this.toDomain(record) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    legalName: string;
    commercialName: string | null;
    taxId: string;
    environment: string;
    emissionType: string;
    accountingObligated: boolean;
    specialTaxpayerCode: string | null;
    rimpeTaxpayerType: string | null;
    matrixAddress: string;
    establishmentAddress: string;
    createdAt: Date;
    updatedAt: Date;
  }): IssuerProfile {
    return IssuerProfile.create({
      id: record.id,
      tenantId: record.tenantId,
      legalName: record.legalName,
      commercialName: record.commercialName,
      taxId: record.taxId,
      environment: record.environment as IssuerEnvironment,
      emissionType: record.emissionType as IssuerEmissionType,
      accountingObligated: record.accountingObligated,
      specialTaxpayerCode: record.specialTaxpayerCode,
      rimpeTaxpayerType: record.rimpeTaxpayerType,
      matrixAddress: record.matrixAddress,
      establishmentAddress: record.establishmentAddress,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
