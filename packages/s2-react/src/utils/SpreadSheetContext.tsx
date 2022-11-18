import React from 'react';
import type { SpreadSheet } from '@antv/s2';
import type { TableFacet } from 's2-core/src/facet';

export const facet: TableFacet | null = null;

export const SpreadSheetContext = React.createContext<SpreadSheet>(null as any);

export function useSpreadSheetRef() {
  return React.useContext(SpreadSheetContext);
}
