import React from 'react';
import { debounce } from 'lodash';
import type { SpreadSheet } from '@antv/s2';
import { Adaptive } from '@/components';

export interface UseResizeEffectParams {
  container: HTMLDivElement; // 只包含了 sheet 容器
  wrapper: HTMLDivElement; // 包含了 sheet + foot(page) + header
  s2: SpreadSheet;
  adaptive: Adaptive;
  optionWidth: number;
  optionHeight: number;
}

const RENDER_DELAY = 200; // ms

function analyzeAdaptive(paramsContainer: HTMLElement, adaptive: Adaptive) {
  let container = paramsContainer;
  let adaptiveWidth = true;
  let adaptiveHeight = false;
  if (typeof adaptive !== 'boolean') {
    container = adaptive?.getContainer?.() || paramsContainer;
    adaptiveWidth = adaptive?.width ?? true;
    adaptiveHeight = adaptive?.height ?? true;
  }
  return { container, adaptiveWidth, adaptiveHeight };
}

export const useResize = (params: UseResizeEffectParams) => {
  const { s2, adaptive, container, optionWidth, optionHeight } = params;
  const {
    container: wrapper,
    adaptiveWidth,
    adaptiveHeight,
  } = analyzeAdaptive(params.wrapper, adaptive);

  // 第一次自适应时不需要 debounce, 防止抖动
  const isFirstRender = React.useRef<boolean>(true);

  const render = React.useCallback(
    (width: number, height: number) => {
      s2.changeSheetSize(width, height);
      s2.render(false);
      isFirstRender.current = false;
    },
    [s2],
  );

  React.useLayoutEffect(() => {
    const isSetResize = wrapper && container && adaptive;
    if (!isSetResize) {
      return;
    }
    const resizeObserver = new ResizeObserver(
      debounce(([entry]: ResizeObserverEntry[] = []) => {
        if (entry) {
          const [size] = entry.borderBoxSize || [];

          // Safari 不支持 borderBoxSize 属性
          const width = adaptiveWidth
            ? Math.floor(
                (size?.inlineSize || entry.contentRect?.width) ?? optionWidth,
              )
            : optionWidth;
          const height = adaptiveHeight
            ? Math.floor(
                container?.getBoundingClientRect().height ?? optionHeight,
              ) // 去除 header 和 page 后才是 sheet 真正的高度
            : optionHeight;

          if (!adaptiveWidth && !adaptiveHeight) {
            return;
          }
          if (isFirstRender.current) {
            render(width, height);
            return;
          }

          render(width, height);
        }
      }, RENDER_DELAY),
    );

    resizeObserver.observe(wrapper, {
      box: 'border-box',
    });

    return () => {
      resizeObserver.unobserve(wrapper);
    };
  }, [
    wrapper,
    container,
    adaptive,
    adaptiveWidth,
    adaptiveHeight,
    optionWidth,
    optionHeight,
    render,
  ]);
};
