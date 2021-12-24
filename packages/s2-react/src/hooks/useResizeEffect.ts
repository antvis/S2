import React from 'react';
import { debounce } from 'lodash';
import type { SpreadSheet, S2Options } from '@antv/s2';
import { Adaptive, AdaptiveContainer } from '@/components';

export interface UseResizeEffectParams {
  container: AdaptiveContainer;
  spreadsheet: SpreadSheet;
  adaptive: Adaptive;
  options: S2Options;
}

const RENDER_DELAY = 200; // ms

function analyzeAdaptive(
  paramsContainer: AdaptiveContainer,
  adaptive: Adaptive,
) {
  let container = paramsContainer;
  let adaptiveWidth = true;
  let adaptiveHeight = true;
  if (typeof adaptive !== 'boolean') {
    container = adaptive?.container() || paramsContainer;
    adaptiveWidth = adaptive?.width ?? true;
    adaptiveHeight = adaptive?.height ?? true;
  }
  return { container, adaptiveWidth, adaptiveHeight };
}

export const useResizeEffect = (params: UseResizeEffectParams) => {
  const { spreadsheet: s2, adaptive, options = {} as S2Options } = params;
  const { container, adaptiveWidth, adaptiveHeight } = analyzeAdaptive(
    params.container,
    adaptive,
  );
  // 第一次自适应时不需要 debounce, 防止抖动
  const isFirstRender = React.useRef<boolean>(true);

  const render = React.useCallback(
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
    if (!adaptive) {
      s2?.changeSize(options.width, options.height);
      s2?.render(false);
    }
  }, [options.width, options.height, adaptive]);

  // rerender by container resize or window resize
  React.useLayoutEffect(() => {
    if (!container || !adaptive) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry] = []) => {
      if (entry) {
        const [size] = entry.borderBoxSize || [];
        const width = adaptiveWidth ? size?.inlineSize : options?.width;
        const height = adaptiveHeight ? size?.blockSize : options?.height;
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
  }, [
    adaptive,
    adaptiveHeight,
    adaptiveWidth,
    container,
    debounceRender,
    options?.height,
    options?.width,
    render,
  ]);
};
