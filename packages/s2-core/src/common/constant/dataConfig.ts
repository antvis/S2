import type { S2DataConfig } from '../../common/interface/s2DataConfig';

export const DEFAULT_DATA_CONFIG: Readonly<S2DataConfig> = {
  data: [],
  fields: {
    rows: [],
    columns: [],
    values: [],
    valueInCols: true,
  },
  meta: [],
  sortParams: [],
  filterParams: [],
};
