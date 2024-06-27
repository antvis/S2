import {
  EXTRA_FIELD,
  PivotFacet,
  PivotSheet,
  setupDataConfig,
  setupOptions,
  type S2DataConfig,
  type S2Options,
} from '@antv/s2';
import { last } from 'lodash';
import {
  DEFAULT_COL_AXIS_SIZE,
  DEFAULT_DIMENSION_SIZE,
  DEFAULT_MEASURE_SIZE,
  DEFAULT_OPTIONS,
  DEFAULT_ROW_AXIS_SIZE,
  FIXED_DATA_CONFIG,
  FIXED_OPTIONS,
} from './constant';
import { PivotChartFacet } from './facet/pivot-chart-facet';
import { getCustomTheme } from './utils/theme';

export * from './interface';

export class PivotChart extends PivotSheet {
  protected override setupDataConfig(dataCfg: S2DataConfig): void {
    this.dataCfg = setupDataConfig(dataCfg, FIXED_DATA_CONFIG);
  }

  protected override setupOptions(options: S2Options | null) {
    this.options = setupOptions(
      DEFAULT_OPTIONS,
      this.getRuntimeOptions(),
      options,
      FIXED_OPTIONS,
    );
  }

  protected override initTheme() {
    this.setThemeCfg(
      {
        name: 'default',
      },
      getCustomTheme,
    );
  }

  protected override buildFacet(): void {
    super.buildFacet(
      this.isCustomRowFields() || this.isCustomColumnFields()
        ? PivotFacet
        : PivotChartFacet,
    );
  }

  protected getRuntimeOptions(): S2Options {
    const { columns = [], valueInCols = true } = this.dataCfg.fields ?? {};

    if (valueInCols) {
      return {
        style: {
          rowCell: {},
          colCell: {
            heightByField: {
              [EXTRA_FIELD]: DEFAULT_COL_AXIS_SIZE,
            },
          },
          dataCell: {
            width: DEFAULT_MEASURE_SIZE,
            height: DEFAULT_DIMENSION_SIZE,
          },
        },
      };
    }

    const lastCol = last(columns) as string;

    return {
      style: {
        rowCell: {
          widthByField: {
            [EXTRA_FIELD]: DEFAULT_ROW_AXIS_SIZE,
          },
        },
        colCell: {
          heightByField: {
            [lastCol]: DEFAULT_COL_AXIS_SIZE,
          },
        },
        dataCell: {
          width: DEFAULT_DIMENSION_SIZE,
          height: DEFAULT_MEASURE_SIZE,
        },
      },
    };
  }
}
