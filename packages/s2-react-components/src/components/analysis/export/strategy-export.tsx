import React from 'react';
import { Export } from './export';
import type { ExportProps } from './interface';
import { strategyCopy } from './strategy-copy';

export const StrategyExport: React.FC<ExportProps> = React.memo((props) => {
  return <Export {...props} customCopyMethod={strategyCopy} />;
});

StrategyExport.displayName = 'StrategyExport';
