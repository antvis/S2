import type { SpreadSheet } from '@antv/s2';
import React from 'react';

export const SpreadSheetContext = React.createContext<SpreadSheet>(
  null as unknown as SpreadSheet,
);

export function useSpreadSheetInstance() {
  return React.useContext(SpreadSheetContext);
}
