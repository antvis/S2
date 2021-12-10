import React from 'react';
import { debounce } from 'lodash';
import type { S2Options, SpreadSheet } from '@antv/s2';
import { usePrevious } from './usePrevious';

export interface UseResizeEffectParams {
  container: HTMLElement;
  s2: SpreadSheet;
  adaptive: boolean;
}

const RENDER_DELAY = 200; // ms

export const useResize = (params: UseResizeEffectParams) => {
  const { container, s2, adaptive } = params;

  const prevOptions = usePrevious<S2Options>(s2?.options);
  // 第一次自适应时不需要 debounce, 防止抖动
  const isFirstRender = React.useRef<boolean>(true);

  const render = (width: number, height: number) => {
    s2.changeSize(width, height);
    s2.render(false);
    isFirstRender.current = false;
  };

  const debounceRender = debounce(render, RENDER_DELAY);

  // rerender by option
  React.useEffect(() => {
    if (!adaptive && s2 && prevOptions) {
      const isChanged =
        prevOptions.width !== s2.options.width ||
        prevOptions.height !== s2.options.height;

      if (!isChanged) {
        return;
      }
      s2.changeSize(s2.options.width, s2.options.height);
      s2.render(false);
    }
  }, [s2?.options.width, s2?.options.height, adaptive, s2, prevOptions]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adaptive, container, render]);
};
