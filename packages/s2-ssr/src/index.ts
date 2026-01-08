// Setup Node.js environment before any other imports
import './env';

export { createCanvas } from './canvas';
export { setupNodeEnvironment } from './env';
export { createSpreadsheet } from './spreadsheet';
export type { MetaData, Options, Spreadsheet } from './types';

// Re-export S2 classes for convenience
export { PivotSheet, SpreadSheet, TableSheet } from '@antv/s2';
