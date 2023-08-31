import React from 'react';
import type { SpreadSheet } from '@antv/s2';

export const SpreadSheetContext = React.createContext<SpreadSheet>(
  null as unknown as SpreadSheet,
);

export function useSpreadSheetInstance() {
  return React.useContext(SpreadSheetContext);
}
