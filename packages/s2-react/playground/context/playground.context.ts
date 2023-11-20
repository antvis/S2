import React from 'react';
import type { SpreadSheet, ThemeCfg } from '@antv/s2';
import { noop } from 'lodash';
import type { SheetComponentsProps } from '../../src';

export const PlaygroundContext = React.createContext<{
  ref?: React.MutableRefObject<SpreadSheet | null>;
  onMounted: SheetComponentsProps['onMounted'];
  themeCfg: ThemeCfg;
}>({
  onMounted: noop,
  themeCfg: { name: 'default' },
});

export function usePlaygroundContext() {
  return React.useContext(PlaygroundContext);
}
