import type { SpreadSheet } from '@antv/s2';
import { shallowRef } from 'vue';

export interface SheetExpose {
  instance: SpreadSheet | undefined;
}

export const useExpose = (expose: (exposed?: Record<string, any>) => void) => {
  const s2Ref = shallowRef<SheetExpose>();

  expose({
    get instance() {
      return s2Ref.value?.instance;
    },
  });

  return s2Ref;
};
