import type {
  EcommerceLaunchPlanResponseDto,
  EcommerceLaunchWorkspaceResponseDto,
} from '../../ecommerce/dto/ecommerce-launch-workspace.response';
import {
  toEcommerceLaunchPlanResponseDto,
  toEcommerceLaunchWorkspaceResponseDto,
} from '../../ecommerce/dto/ecommerce-launch-workspace.response';

export type AiEcommerceLaunchPlanResponseDto =
  EcommerceLaunchPlanResponseDto;

export type AiEcommerceLaunchWorkspaceResponseDto =
  EcommerceLaunchWorkspaceResponseDto;

export const toAiEcommerceLaunchWorkspaceResponseDto =
  toEcommerceLaunchWorkspaceResponseDto;

export const toAiEcommerceLaunchPlanResponseDto =
  toEcommerceLaunchPlanResponseDto;
