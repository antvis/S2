import { IconCondition } from '@/common/interface';

export const getIconPositionCfg = (condition: IconCondition) => {
  return condition?.position ?? 'right';
};
