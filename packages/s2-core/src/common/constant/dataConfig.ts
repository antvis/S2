import { S2DataConfig } from '@/common/interface/s2DataConfig';

export const DEFAULT_DATA_CONFIG: Readonly<S2DataConfig> = {
  data: [],
  totalData: [],
  fields: {
    rows: [],
    columns: [],
    values: [],
    customTreeItems: [],
    valueInCols: true,
  },
  meta: [],
  sortParams: [],
  filterParams: [],
};
