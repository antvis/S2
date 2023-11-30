import { noop } from 'lodash';
import React from 'react';
import type { SpreadSheet, ThemeCfg } from '@antv/s2';
import type { SheetComponentsProps } from '../../src';

export const PlaygroundContext = React.createContext<
  Partial<SheetComponentsProps> & {
    ref?: React.MutableRefObject<SpreadSheet | null>;
    setThemeCfg: (theme: ThemeCfg) => void;
  }
>({
  onMounted: noop,
  themeCfg: { name: 'default' },
  setThemeCfg: () => {},
});

export function usePlaygroundContext() {
  return React.useContext(PlaygroundContext);
}
