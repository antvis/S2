import { debounce } from 'lodash';
import { RESIZE_RENDER_DELAY } from '../constants';
import { Adaptive, ResizeEffectParams } from '../interface';

export const analyzeAdaptive = (
  paramsContainer: HTMLElement,
  adaptive: Adaptive,
) => {
  let container = paramsContainer;
  let adaptiveWidth = true;
  let adaptiveHeight = false;
  if (typeof adaptive !== 'boolean') {
    container = adaptive?.getContainer?.() || paramsContainer;
    adaptiveWidth = adaptive?.width ?? true;
    adaptiveHeight = adaptive?.height ?? true;
  }
  return { container, adaptiveWidth, adaptiveHeight };
};

export const createResizeObserver = (params: ResizeEffectParams) => {
  const { s2, adaptive, container, wrapper, render } = params;
  const {
    container: actualWrapper,
    adaptiveWidth,
    adaptiveHeight,
  } = analyzeAdaptive(wrapper, adaptive);

  const resizeObserver = new ResizeObserver(
    debounce(([entry]: ResizeObserverEntry[] = []) => {
      if (entry) {
        const { width: nodeWidth, height: nodeHeight } =
          container?.getBoundingClientRect();

        const width = adaptiveWidth
          ? Math.floor(nodeWidth ?? s2.options.width)
          : s2.options.width;
        const height = adaptiveHeight
          ? // 去除 header 和 page 后才是 sheet 真正的高度
            Math.floor(nodeHeight ?? s2.options.height)
          : s2.options.height;

        if (!adaptiveWidth && !adaptiveHeight) {
          return;
        }
        render?.(width, height);
      }
    }, RESIZE_RENDER_DELAY),
  );

  resizeObserver.observe(actualWrapper, {
    box: 'border-box',
  });

  return () => {
    resizeObserver.unobserve(actualWrapper);
  };
};
