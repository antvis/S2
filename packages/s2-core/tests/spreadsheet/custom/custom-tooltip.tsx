import * as React from 'react';
import { BaseTooltip } from '../../../src/tooltip';
import Infos from '../../../src/common/tooltip/components/infos';
import { Aggregation, SpreadSheet } from '../../../src';

export class CustomTooltip extends BaseTooltip {
  constructor(plot: SpreadSheet, aggregation?: Aggregation) {
    super(plot, aggregation);
  }

  protected renderInfos(infos: string) {
    return <Infos infos={`重写info测试 ${infos}`} />;
  }
}
