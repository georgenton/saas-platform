import { useMemo } from 'react';
import {
  createCommandCenterModel,
  type CommandCenterModel,
  type CreateCommandCenterModelInput,
} from './adapters';

export function useCommandCenterModel(
  input: CreateCommandCenterModelInput,
): CommandCenterModel {
  return useMemo(() => createCommandCenterModel(input), [input]);
}
