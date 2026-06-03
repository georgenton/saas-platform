import { Module } from '@nestjs/common';
import {
  ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
  ECOMMERCE_ORDER_DRAFT_REPOSITORY,
  ECOMMERCE_ORDER_OPERATIONAL_EVENT_REPOSITORY,
  ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
  ECOMMERCE_PRODUCT_ENTITY_REPOSITORY,
  ECOMMERCE_PRODUCT_SETUP_REPOSITORY,
} from '@saas-platform/ecommerce-application';
import { PrismaModule } from '../prisma.module';
import { PrismaEcommerceProductDraftRepository } from './prisma-ecommerce-product-draft.repository';
import { PrismaEcommerceOrderDraftRepository } from './prisma-ecommerce-order-draft.repository';
import { PrismaEcommerceOrderOperationalEventRepository } from './prisma-ecommerce-order-operational-event.repository';
import { PrismaEcommerceProductEntityChannelDraftRepository } from './prisma-ecommerce-product-entity-channel-draft.repository';
import { PrismaEcommerceProductEntityRepository } from './prisma-ecommerce-product-entity.repository';
import { PrismaEcommerceProductSetupRepository } from './prisma-ecommerce-product-setup.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaEcommerceProductDraftRepository,
    PrismaEcommerceOrderDraftRepository,
    PrismaEcommerceOrderOperationalEventRepository,
    PrismaEcommerceProductEntityChannelDraftRepository,
    PrismaEcommerceProductEntityRepository,
    PrismaEcommerceProductSetupRepository,
    {
      provide: ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
      useExisting: PrismaEcommerceProductDraftRepository,
    },
    {
      provide: ECOMMERCE_ORDER_DRAFT_REPOSITORY,
      useExisting: PrismaEcommerceOrderDraftRepository,
    },
    {
      provide: ECOMMERCE_ORDER_OPERATIONAL_EVENT_REPOSITORY,
      useExisting: PrismaEcommerceOrderOperationalEventRepository,
    },
    {
      provide: ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
      useExisting: PrismaEcommerceProductEntityChannelDraftRepository,
    },
    {
      provide: ECOMMERCE_PRODUCT_ENTITY_REPOSITORY,
      useExisting: PrismaEcommerceProductEntityRepository,
    },
    {
      provide: ECOMMERCE_PRODUCT_SETUP_REPOSITORY,
      useExisting: PrismaEcommerceProductSetupRepository,
    },
  ],
  exports: [
    ECOMMERCE_PRODUCT_DRAFT_REPOSITORY,
    ECOMMERCE_ORDER_DRAFT_REPOSITORY,
    ECOMMERCE_ORDER_OPERATIONAL_EVENT_REPOSITORY,
    ECOMMERCE_PRODUCT_ENTITY_CHANNEL_DRAFT_REPOSITORY,
    ECOMMERCE_PRODUCT_ENTITY_REPOSITORY,
    ECOMMERCE_PRODUCT_SETUP_REPOSITORY,
  ],
})
export class EcommercePersistenceModule {}
