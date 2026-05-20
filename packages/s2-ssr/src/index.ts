// Note: setupNodeEnvironment is exported for users who need manual env setup
// This import is intentionally removed to prevent global mock pollution

export { createCanvas } from './canvas';
export { setupNodeEnvironment } from './env';
export { createSpreadsheet } from './spreadsheet';
export type { MetaData, Options, Spreadsheet } from './types';

// Re-export S2 classes for convenience
export { PivotSheet, SpreadSheet, TableSheet } from '@antv/s2';
