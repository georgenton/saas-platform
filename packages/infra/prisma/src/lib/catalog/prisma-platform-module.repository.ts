import { Injectable } from '@nestjs/common';
import { PlatformModuleRepository } from '@saas-platform/catalog-application';
import { PlatformModule } from '@saas-platform/catalog-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPlatformModuleRepository implements PlatformModuleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProductId(productId: string): Promise<PlatformModule[]> {
    const modules = await this.prisma.platformModule.findMany({
      where: { productId },
      orderBy: { name: 'asc' },
    });

    return modules.map((module) => this.toDomain(module));
  }

  private toDomain(record: {
    id: string;
    productId: string;
    key: string;
    name: string;
    description: string | null;
    isCore: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): PlatformModule {
    return PlatformModule.create({
      id: record.id,
      productId: record.productId,
      key: record.key,
      name: record.name,
      description: record.description,
      isCore: record.isCore,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
