import { strategyCopy } from '@antv/s2';
import React from 'react';
import { Export } from './export';
import type { ExportProps } from './interface';

export const StrategyExport: React.FC<ExportProps> = React.memo((props) => {
  return <Export {...props} customCopyMethod={strategyCopy} />;
});

StrategyExport.displayName = 'StrategyExport';
