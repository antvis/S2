/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { debounce, round } from 'lodash';
import type { SpreadSheet } from '@antv/s2';
import { Adaptive } from '@/components';

export interface UseResizeEffectParams {
  container: HTMLDivElement; // 只包含了 sheet 容器
  wrapper: HTMLDivElement; // 包含了 sheet + foot(page) + header
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
  const { s2, adaptive, container } = params;
  const {
    container: wrapper,
    adaptiveWidth,
    adaptiveHeight,
  } = analyzeAdaptive(params.wrapper, adaptive);

  // 第一次自适应时不需要 debounce, 防止抖动
  const isFirstRender = React.useRef<boolean>(true);

  const render = useCallback(
    (width: number, height: number) => {
      s2.changeSheetSize(width, height);
      s2.render(false);
      isFirstRender.current = false;
    },
    [s2],
  );

  const debounceRender = debounce(render, RENDER_DELAY);

  // rerender by option
  React.useEffect(() => {
    if (!adaptive && s2) {
      s2.render(false);
    }
  }, [s2?.options.width, s2?.options.height, adaptive, s2]);

  // rerender by container resize or window resize
  React.useLayoutEffect(() => {
    if (!wrapper || !adaptive || !container) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry] = []) => {
      if (entry) {
        const [size] = entry.borderBoxSize || [];
        const width = adaptiveWidth
          ? round(size?.inlineSize)
          : s2?.options.width;
        const height = adaptiveHeight
          ? round(container?.getBoundingClientRect().height) // 去除 header 和 page 后才是 sheet 真正的高度
          : s2?.options.height;
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

    resizeObserver.observe(wrapper, {
      box: 'border-box',
    });

    return () => {
      resizeObserver.unobserve(wrapper);
    };
  }, [
    wrapper,
    container,
    adaptiveWidth,
    adaptiveHeight,
    s2?.options.width,
    s2?.options.height,
    render,
  ]);
};
