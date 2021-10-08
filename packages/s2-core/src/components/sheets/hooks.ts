import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { SpreadSheet } from '@/sheet-type';
import { S2Options } from '@/common/interface';

export const useResizeEffect = (
  container,
  s2: SpreadSheet,
  adaptive: boolean,
  options: S2Options,
) => {
  const [resizeTimeStamp, setResizeTimeStamp] = useState<number | null>(null);
  const debounceResize = debounce((e: Event) => {
    setResizeTimeStamp(e.timeStamp);
  }, 200);
  useEffect(() => {
    if (!container.current || !s2) return;

    const style = getComputedStyle(container.current);

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

export const a = () => {};
