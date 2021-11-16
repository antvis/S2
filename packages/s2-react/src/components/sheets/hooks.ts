import { useEffect, useState } from 'react';
import { debounce, isEmpty, merge } from 'lodash';
import { SpreadSheet, S2Options, getSafetyOptions } from '@antv/s2';

export interface UseResizeEffectParams {
  container: HTMLDivElement;
  spreadsheet: SpreadSheet;
  adaptive: boolean;
  options: S2Options;
}

export const useResizeEffect = (params: UseResizeEffectParams) => {
  const {
    container,
    spreadsheet: s2,
    adaptive,
    options = {} as S2Options,
  } = params;
  const [resizeTimeStamp, setResizeTimeStamp] = useState<number | null>(null);
  const debounceResize = debounce((e: Event) => {
    setResizeTimeStamp(e.timeStamp);
  }, 200);

  useEffect(() => {
    if (!container || !adaptive) {
      return;
    }

    const style = getComputedStyle(container);

    const box = {
      width: parseInt(style.getPropertyValue('width').replace('px', ''), 10),
      height: parseInt(style.getPropertyValue('height').replace('px', ''), 10),
    };

    s2.changeSize(box?.width, box?.height);
    s2.render(false);
  }, [resizeTimeStamp, container, adaptive]);

  useEffect(() => {
    if (!adaptive) {
      s2?.changeSize(options.width, options.height);
      s2?.render(false);
    }
  }, [options.width, options.height, adaptive]);

  useEffect(() => {
    if (adaptive) {
      window.addEventListener('resize', debounceResize);
    }
    return () => {
      if (adaptive) {
        window.removeEventListener('resize', debounceResize);
      }
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
    s2.setOptions(getSafetyOptions(newOptions));
    s2.render(false);
  }, [options, current, pageSize, s2]);
};
