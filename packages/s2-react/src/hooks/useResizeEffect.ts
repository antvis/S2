import React from 'react';
import { debounce } from 'lodash';
import type { SpreadSheet, S2Options } from '@antv/s2';

export interface UseResizeEffectParams {
  container: HTMLDivElement;
  spreadsheet: SpreadSheet;
  adaptive: boolean;
  options: S2Options;
}

const RENDER_DELAY = 200; // ms

export const useResizeEffect = (params: UseResizeEffectParams) => {
  const {
    container,
    spreadsheet: s2,
    adaptive,
    options = {} as S2Options,
  } = params;

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
        if (isFirstRender.current) {
          render(size.inlineSize, size.blockSize);
          return;
        }
        debounceRender(size.inlineSize, size.blockSize);
      }
    });

    resizeObserver.observe(container, {
      box: 'border-box',
    });

    return () => {
      resizeObserver.unobserve(container);
    };
  }, [adaptive, container, debounceRender, render]);
};
