import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import {
  GetPlanByKeyUseCase,
  ListPlanEntitlementsUseCase,
  ListPlansUseCase,
  PlanNotFoundError,
} from '@saas-platform/commercial-application';
import {
  PlanEntitlementResponseDto,
  toPlanEntitlementResponseDto,
} from './dto/plan-entitlement.response';
import { PlanResponseDto, toPlanResponseDto } from './dto/plan.response';

@Controller('platform/plans')
export class PlatformCommercialController {
  constructor(
    private readonly getPlanByKeyUseCase: GetPlanByKeyUseCase,
    private readonly listPlanEntitlementsUseCase: ListPlanEntitlementsUseCase,
    private readonly listPlansUseCase: ListPlansUseCase,
  ) {}

  @Get()
  async listPlans(): Promise<PlanResponseDto[]> {
    const plans = await this.listPlansUseCase.execute();

    return plans.map((plan) => toPlanResponseDto(plan));
  }

  @Get(':planKey')
  async getPlanByKey(
    @Param('planKey') planKey: string,
  ): Promise<PlanResponseDto> {
    try {
      const plan = await this.getPlanByKeyUseCase.execute(planKey);

      return toPlanResponseDto(plan);
    } catch (error) {
      if (error instanceof PlanNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':planKey/entitlements')
  async listPlanEntitlements(
    @Param('planKey') planKey: string,
  ): Promise<PlanEntitlementResponseDto[]> {
    try {
      const entitlements = await this.listPlanEntitlementsUseCase.execute(
        planKey,
      );

      return entitlements.map((entitlement) =>
        toPlanEntitlementResponseDto(entitlement),
      );
    } catch (error) {
      if (error instanceof PlanNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
