import React from 'react';
import { BaseTooltip } from '@/ui/tooltip';
import { Infos } from '@/ui/tooltip/components/infos';
import { SimpleTips } from '@/ui/tooltip/components/simple-tips';

const extra = [
  {
    field: 'type',
    value: '办公用品',
    tips: '说明：这是办公用品的说明',
  },
];

export class CustomTooltip extends BaseTooltip {
  protected renderInfos() {
    return <Infos infos="按住Cmd/Ctrl或框选，查看多个数据点" />;
  }

  protected renderNameTips(nameTip) {
    const { tips } = extra.find((item) => item.value === nameTip.name) || {};
    if (tips) {
      return <SimpleTips tips={tips} name={nameTip.name} />;
    }
    return super.renderNameTips(nameTip);
  }
}
