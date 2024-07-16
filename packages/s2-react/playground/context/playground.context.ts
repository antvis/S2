import type { SpreadSheet, ThemeCfg } from '@antv/s2';
import { noop } from 'lodash';
import React from 'react';
import type { SheetComponentProps } from '../../src';

export const PlaygroundContext = React.createContext<
  Partial<SheetComponentProps> & {
    ref?: React.MutableRefObject<SpreadSheet | null>;
    setThemeCfg: (theme: ThemeCfg) => void;
    logHandler: (
      name: string,
      callback?: (...args: any[]) => void,
    ) => (...args: any[]) => void;
  }
>({
  onMounted: noop,
  themeCfg: { name: 'default' },
  setThemeCfg: () => {},
  logHandler: () => () => {},
});

export function usePlaygroundContext() {
  return React.useContext(PlaygroundContext);
}
