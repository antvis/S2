import {
  EXTRA_FIELD,
  PivotSheet,
  ResizeType,
  setupDataConfig,
  setupOptions,
  type S2DataConfig,
  type S2Options,
  type ThemeCfg,
  type ViewMeta,
} from '@antv/s2';
import { last } from 'lodash';
import { PivotChartDataCell } from './cell/pivot-chart-data-cell';
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
import { RootInteraction } from './interaction/root';
import { getCustomTheme as defaultGetCustomTheme } from './utils/theme';

export class PivotChartSheet extends PivotSheet {
  protected override initInteraction() {
    this.interaction?.destroy?.();
    this.interaction = new RootInteraction(this);
  }

  protected override setupDataConfig(dataCfg: S2DataConfig): void {
    this.dataCfg = setupDataConfig(dataCfg, FIXED_DATA_CONFIG);
  }

  protected override setupOptions(options: S2Options | null) {
    this.options = setupOptions(
      DEFAULT_OPTIONS,
      this.getRuntimeDefaultOptions(options),
      options,
      this.getRuntimeFixedOptions(),
      FIXED_OPTIONS,
    );
  }

  public setThemeCfg(
    themeCfg: ThemeCfg = {},
    getCustomTheme = defaultGetCustomTheme,
  ) {
    super.setThemeCfg(themeCfg, getCustomTheme);
  }

  protected override buildFacet(): void {
    if (this.isCustomRowFields() || this.isCustomColumnFields()) {
      super.buildFacet();

      return;
    }

    const defaultCell = (viewMeta: ViewMeta) =>
      new PivotChartDataCell(viewMeta, this);

    this.options.dataCell ??= defaultCell;
    this.facet?.destroy();
    this.facet = this.options.facet?.(this) ?? new PivotChartFacet(this);
    this.facet.render();
  }

  protected getRuntimeDefaultOptions(options: S2Options | null): S2Options {
    const {
      rows = [],
      columns = [],
      valueInCols = true,
    } = this.dataCfg.fields ?? {};

    /**
     * 下面的逻辑准则：
     *    如果是笛卡尔坐标系，希望 x 轴 dimension 的每个维度默认宽度大致相同，y 轴 measure 的宽度始终保持都相同
     *      比如对于 rows: province-> city , value: number 来说
     *         四川下面有 n 个城市，北京下面有 m 个城市，那么四川的宽度是 n * width, 北京的宽度是 m * width
     *         而不管是四川，还是北京， y 轴展示的都是 number 的值，那么 y 轴的宽度保持相同，能快速通过图形的尺寸看出数据的相对大小。
     *    如果是极坐标系， 希望 x 轴宽度相同，y 轴 measure 的宽度也都相同
     *         比如对于 rows: province-> city , value: number 来说
     *         四川下面有 n 个城市，北京下面有 m 个城市，那么四川的宽度是 width, 北京的宽度也是 width，不再以维度数量作为依据，能让数据的呈现效果更好
     */

    const isPolar = this.isPolarCoordinate(options);

    if (valueInCols) {
      const lastRow = last(rows) as string;

      return {
        style: {
          rowCell: {
            widthByField: {
              [lastRow]: DEFAULT_ROW_AXIS_SIZE,
            },
          },
          colCell: {
            heightByField: {
              [EXTRA_FIELD]: DEFAULT_COL_AXIS_SIZE,
            },
          },
          dataCell: {
            width: DEFAULT_MEASURE_SIZE,
            height: isPolar ? DEFAULT_MEASURE_SIZE : DEFAULT_DIMENSION_SIZE,
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
          width: isPolar ? DEFAULT_MEASURE_SIZE : DEFAULT_DIMENSION_SIZE,
          height: DEFAULT_MEASURE_SIZE,
        },
      },
    };
  }

  protected getRuntimeFixedOptions(): S2Options {
    const { valueInCols = true } = this.dataCfg.fields ?? {};

    if (valueInCols) {
      return {
        interaction: {
          resize: {
            rowResizeType: ResizeType.CURRENT,
            colResizeType: ResizeType.ALL,
          },
        },
      };
    }

    return {
      interaction: {
        resize: {
          rowResizeType: ResizeType.ALL,
          colResizeType: ResizeType.CURRENT,
        },
      },
    };
  }

  isPolarCoordinate(options: S2Options | null = this.options) {
    return options?.chart?.coordinate === 'polar';
  }

  enableAsyncExport() {
    return new Error("pivot chart doesn't support export all data");
  }
}
