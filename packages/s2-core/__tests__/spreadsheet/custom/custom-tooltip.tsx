import * as React from 'react';
import { BaseTooltip } from '../../../src/tooltip';
import Infos from '../../../src/common/tooltip/components/infos';
import { BaseSpreadSheet } from '../../../src/sheet-type';
import { Aggregation } from '../../../src';

export class CustomTooltip extends BaseTooltip {
  constructor(plot: BaseSpreadSheet, aggregation?: Aggregation) {
    super(plot, aggregation);
  }

  protected renderInfos(infos: string) {
    return <Infos infos={'重写info测试'} />;
  }
}
