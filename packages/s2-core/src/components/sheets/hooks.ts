import { useEffect, useState } from 'react';
import { debounce, isEmpty, merge } from 'lodash';
import { SpreadSheet } from '@/sheet-type';
import { S2Options, safetyOptions } from '@/common/interface';

export const useResizeEffect = (
  container: HTMLDivElement,
  s2: SpreadSheet,
  adaptive: boolean,
  options: S2Options,
) => {
  const [resizeTimeStamp, setResizeTimeStamp] = useState<number | null>(null);
  const debounceResize = debounce((e: Event) => {
    setResizeTimeStamp(e.timeStamp);
  }, 200);
  useEffect(() => {
    if (!container || !s2) return;

    const style = getComputedStyle(container);

    const box = {
      width: parseInt(style.getPropertyValue('width').replace('px', ''), 10),
      height: parseInt(style.getPropertyValue('height').replace('px', ''), 10),
    };

    s2.changeSize(box?.width, box?.height);
    s2.render(false);
  }, [resizeTimeStamp, container, s2, options.width, options.height]);

  useEffect(() => {
    // 监听窗口变化
    if (adaptive) window.addEventListener('resize', debounceResize);
    return () => {
      if (adaptive) window.removeEventListener('resize', debounceResize);
    };
  }, [adaptive, debounceResize]);
};

export const usePaginationEffect = (
  s2: SpreadSheet,
  options: S2Options,
  current: number,
  pageSize: number,
) => {
  useEffect(() => {
    if (!s2 || isEmpty(options?.pagination)) return;
    const newOptions = merge({}, options, {
      pagination: {
        current,
        pageSize,
      },
    });
    s2.setOptions(safetyOptions(newOptions));
    s2.render(false);
  }, [options, current, pageSize, s2]);
};
