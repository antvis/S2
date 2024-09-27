import { createResizeObserver, type ResizeEffectParams } from '@antv/s2';
import React from 'react';

export const useResize = (params: ResizeEffectParams) => {
  const { s2, adaptive, container, wrapper } = params;

  React.useLayoutEffect(
    () => createResizeObserver({ s2, adaptive, wrapper, container }),
    [s2, wrapper, container, adaptive],
  );
};
