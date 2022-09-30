import * as React from 'react';
import type { SpreadSheet } from '@antv/s2';

const SpreadSheetContext = React.createContext<SpreadSheet>(null as any);
export function useSpreadSheetRef() {
  return React.useContext(SpreadSheetContext);
}

export default SpreadSheetContext;
