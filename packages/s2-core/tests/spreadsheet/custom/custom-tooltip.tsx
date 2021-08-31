import React from 'react';
import { get } from 'lodash';
import { BaseTooltip } from '@/tooltip';
import Infos from '@/common/tooltip/components/infos';
import NameTips from '@/common/tooltip/components/simple-tips';

export class CustomTooltip extends BaseTooltip {
  protected renderInfos() {
    return <Infos infos="按住Cmd/Ctrl或框选，查看多个数据点" />;
  }

  protected renderNameTips(nameTip) {
    const extra = get(this, 'spreadsheet.dataCfg.fields.extra') || [];
    const { tips, name } =
      extra.find((item) => item.value === nameTip.name) || {};
    if (tips || name) {
      return <NameTips tips={tips} name={name || nameTip.name} />;
    }
    return super.renderNameTips(nameTip);
  }
}
