import React from 'react';
import ReactDOM from 'react-dom';
import {
  SheetComponent,
  BaseTooltip,
  Infos,
  SimpleTips,
  TooltipHead,
  TooltipDetail,
  TooltipOperator,
  TooltipSummary,
  TooltipOperatorOptions,
  ListItem,
} from '@antv/s2';
import insertCss from 'insert-css';
import '@antv/s2/dist/s2.min.css';

const extra = [
  {
    field: 'type',
    value: '笔',
    tips: '说明：这是笔的说明',
  },
];

class CustomTooltip extends BaseTooltip {
  protected renderOperation(
    operator: TooltipOperatorOptions,
    onlyMenu?: boolean,
  ) {
    const customOperator = {
      onClick: () => {
        console.log('测试');
      },
      menus: [
        {
          id: 'trend',
          icon: 'trend',
          text: '趋势',
        },
      ],
    };

    return <TooltipOperator {...customOperator} />;
  }

  protected renderNameTips(nameTip: { name: string; tips: string }) {
    const { tips } = extra.find((item) => item.value === nameTip.name) || {};
    if (tips) {
      return <SimpleTips tips={tips} name={`${nameTip.name} - 测试`} />;
    }
    return super.renderNameTips(nameTip);
  }

  protected renderSummary(summaries) {
    const customSummaries = (summaries || []).map((item) => {
      return { ...item, name: `${item.name} - 测试` };
    });
    return (
      customSummaries.length > 0 && (
        <TooltipSummary summaries={customSummaries} />
      )
    );
  }

  protected renderHeadInfo(headInfo) {
    const { cols = [], rows = [] } = headInfo || {};
    const customCols = cols.map((item) => {
      return { ...item, value: `${item.value} - 测试` };
    });
    return (
      (cols.length > 0 || rows.length > 0) && (
        <>
          <div style={{ borderTop: '1px solid #e9e9e9' }} />
          <TooltipHead cols={customCols} rows={rows} />
        </>
      )
    );
  }

  protected renderDetail(details: ListItem[]) {
    const customDetails = (details || []).map((item) => {
      return { name: `${item.name} - 测试`, value: `${item.value} - w` };
    });
    return customDetails.length > 0 && <TooltipDetail list={customDetails} />;
  }

  protected renderInfos(infos) {
    return <Infos infos={`按住Cmd/Ctrl或框选，查看多个数据点`} />;
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/d62448ea-1f58-4498-8f76-b025dd53e570.json',
)
  .then((res) => res.json())
  .then((data) => {
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data,
    };

    const s2options = {
      width: 600,
      height: 300,
      tooltip: {
        renderTooltip: (spreadsheet) => {
          return new CustomTooltip(spreadsheet);
        },
      },
    };
    const TooltipRenderDemo = () => {
      return (
        <div>
          <SheetComponent
            sheetType={'pivot'}
            adaptive={false}
            dataCfg={s2DataConfig}
            options={s2options}
          />
        </div>
      );
    };

    ReactDOM.render(
      <TooltipRenderDemo />,
      document.getElementById('container'),
    );
  });

insertCss(`
  .tooltip-custom-component {
    padding: 12px;
    height: 50px;
  }
`);
