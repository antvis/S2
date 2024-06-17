import {
  PivotFacet,
  PivotSheet,
  setupDataConfig,
  setupOptions,
  type S2DataConfig,
  type S2Options,
} from '@antv/s2';
import { FIXED_DATA_CONFIG } from './constant/dataCfg';
import { FIXED_OPTIONS } from './constant/options';
import { PivotChartFacet } from './pivot-chart-facet';

export * from './interface';

export class PivotChart extends PivotSheet {
  protected override setupDataConfig(dataCfg: S2DataConfig): void {
    this.dataCfg = setupDataConfig(dataCfg, FIXED_DATA_CONFIG);
  }

  protected override setupOptions(options: S2Options | null) {
    this.options = setupOptions(options, FIXED_OPTIONS);
  }

  protected override buildFacet(): void {
    super.buildFacet(
      this.isCustomRowFields() || this.isCustomColumnFields()
        ? PivotFacet
        : PivotChartFacet,
    );
  }
}
