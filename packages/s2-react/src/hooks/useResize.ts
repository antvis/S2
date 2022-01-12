/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { debounce } from 'lodash';
import type { SpreadSheet } from '@antv/s2';
import { Adaptive } from '@/components';

export interface UseResizeEffectParams {
  container: HTMLElement;
  s2: SpreadSheet;
  adaptive: Adaptive;
}

const RENDER_DELAY = 200; // ms

function analyzeAdaptive(paramsContainer: HTMLElement, adaptive: Adaptive) {
  let container = paramsContainer;
  let adaptiveWidth = true;
  let adaptiveHeight = true;
  if (typeof adaptive !== 'boolean') {
    container = adaptive?.getContainer?.() || paramsContainer;
    adaptiveWidth = adaptive?.width ?? true;
    adaptiveHeight = adaptive?.height ?? true;
  }
  return { container, adaptiveWidth, adaptiveHeight };
}

export const useResize = (params: UseResizeEffectParams) => {
  const { s2, adaptive } = params;
  const { container, adaptiveWidth, adaptiveHeight } = analyzeAdaptive(
    params.container,
    adaptive,
  );

  // 第一次自适应时不需要 debounce, 防止抖动
  const isFirstRender = React.useRef<boolean>(true);

  const render = useCallback(
    (width: number, height: number) => {
      s2.changeSize(width, height);
      s2.render(false);
      isFirstRender.current = false;
    },
    [s2],
  );

  const debounceRender = debounce(render, RENDER_DELAY);

  // rerender by option
  React.useEffect(() => {
    if (!adaptive && s2) {
      s2.changeSize(s2?.options.width, s2?.options.height);
      s2.render(false);
    }
  }, [s2?.options.width, s2?.options.height, adaptive]);

  // rerender by container resize or window resize
  React.useLayoutEffect(() => {
    if (!container || !adaptive) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry] = []) => {
      if (entry) {
        const [size] = entry.borderBoxSize || [];
        const width = adaptiveWidth ? size?.inlineSize : s2?.options.width;
        const height = adaptiveHeight ? size?.blockSize : s2?.options.height;
        if (!adaptiveWidth && !adaptiveHeight) {
          return;
        }
        if (isFirstRender.current) {
          render(width, height);
          return;
        }
        debounceRender(width, height);
      }
    });

    resizeObserver.observe(container, {
      box: 'border-box',
    });

    return () => {
      resizeObserver.unobserve(container);
    };
  }, [adaptiveWidth, adaptiveHeight, s2?.options.width, s2?.options.height]);
};
