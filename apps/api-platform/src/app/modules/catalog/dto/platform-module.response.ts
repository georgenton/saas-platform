import { PlatformModule } from '@saas-platform/catalog-domain';

export interface PlatformModuleResponseDto {
  id: string;
  productId: string;
  key: string;
  name: string;
  description: string | null;
  isCore: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const toPlatformModuleResponseDto = (
  module: PlatformModule,
): PlatformModuleResponseDto => {
  const data = module.toPrimitives();

  return {
    id: data.id,
    productId: data.productId,
    key: data.key,
    name: data.name,
    description: data.description ?? null,
    isCore: data.isCore,
    isActive: data.isActive,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
