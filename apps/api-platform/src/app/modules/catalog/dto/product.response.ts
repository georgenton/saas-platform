import { Product } from '@saas-platform/catalog-domain';

export interface ProductResponseDto {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const toProductResponseDto = (
  product: Product,
): ProductResponseDto => {
  const data = product.toPrimitives();

  return {
    id: data.id,
    key: data.key,
    name: data.name,
    description: data.description ?? null,
    isActive: data.isActive,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
