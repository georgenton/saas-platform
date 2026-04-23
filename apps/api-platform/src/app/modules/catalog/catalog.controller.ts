import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  GetProductByKeyUseCase,
  ListProductModulesUseCase,
  ListProductsUseCase,
  ProductNotFoundError,
} from '@saas-platform/catalog-application';
import {
  PlatformModuleResponseDto,
  toPlatformModuleResponseDto,
} from './dto/platform-module.response';
import { ProductResponseDto, toProductResponseDto } from './dto/product.response';

@Controller('platform/products')
export class CatalogController {
  constructor(
    private readonly getProductByKeyUseCase: GetProductByKeyUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly listProductModulesUseCase: ListProductModulesUseCase,
  ) {}

  @Get()
  async listProducts(): Promise<ProductResponseDto[]> {
    const products = await this.listProductsUseCase.execute();

    return products.map((product) => toProductResponseDto(product));
  }

  @Get(':productKey')
  async getProductByKey(
    @Param('productKey') productKey: string,
  ): Promise<ProductResponseDto> {
    try {
      const product = await this.getProductByKeyUseCase.execute(productKey);

      return toProductResponseDto(product);
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':productKey/modules')
  async listModules(
    @Param('productKey') productKey: string,
  ): Promise<PlatformModuleResponseDto[]> {
    try {
      const modules = await this.listProductModulesUseCase.execute(productKey);

      return modules.map((module) => toPlatformModuleResponseDto(module));
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
