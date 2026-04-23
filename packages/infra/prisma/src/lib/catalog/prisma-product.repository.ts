import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@saas-platform/catalog-application';
import { Product } from '@saas-platform/catalog-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { name: 'asc' },
    });

    return products.map((product) => this.toDomain(product));
  }

  async findByKey(key: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { key },
    });

    return product ? this.toDomain(product) : null;
  }

  private toDomain(record: {
    id: string;
    key: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return Product.create({
      id: record.id,
      key: record.key,
      name: record.name,
      description: record.description,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
