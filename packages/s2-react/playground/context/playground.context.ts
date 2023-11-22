import { noop } from 'lodash';
import React from 'react';
import type { SpreadSheet } from '@antv/s2';
import type { SheetComponentsProps } from '../../src';

export const PlaygroundContext = React.createContext<
  Partial<SheetComponentsProps> & {
    ref?: React.MutableRefObject<SpreadSheet | null>;
  }
>({
  onMounted: noop,
  themeCfg: { name: 'default' },
});

export function usePlaygroundContext() {
  return React.useContext(PlaygroundContext);
}
