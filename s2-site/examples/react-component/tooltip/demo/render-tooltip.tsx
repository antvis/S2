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
} from '@antv/s2-react';
import insertCss from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

const extra = [
  {
    field: 'type',
    value: '笔',
    tips: '说明：这是笔的说明',
  },
];

class CustomTooltip extends BaseTooltip {
  renderOperation(operator, onlyMenu) {
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

  renderNameTips(nameTip) {
    const { tips } = extra.find((item) => item.value === nameTip.name) || {};
    if (tips) {
      return <SimpleTips tips={tips} name={`${nameTip.name} - 测试`} />;
    }
    return super.renderNameTips(nameTip);
  }

  renderSummary(summaries) {
    const customSummaries = (summaries || []).map((item) => {
      return { ...item, name: `${item.name} - 测试` };
    });
    return (
      customSummaries.length > 0 && (
        <TooltipSummary summaries={customSummaries} />
      )
    );
  }

  renderHeadInfo(headInfo) {
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

  renderDetail(details) {
    const customDetails = (details || []).map((item) => {
      return { name: `${item.name} - 测试`, value: `${item.value} - w` };
    });
    return customDetails.length > 0 && <TooltipDetail list={customDetails} />;
  }

  renderInfos(infos) {
    return <Infos infos={`按住 Shift 多选或框选，查看多个数据点`} />;
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options = {
      width: 600,
      height: 480,
      tooltip: {
        renderTooltip: (spreadsheet) => {
          return new CustomTooltip(spreadsheet);
        },
      },
    };

    ReactDOM.render(
      <SheetComponent
        sheetType={'pivot'}
        adaptive={false}
        dataCfg={dataCfg}
        options={s2Options}
      />,
      document.getElementById('container'),
    );
  });

insertCss(`
  .tooltip-custom-component {
    padding: 12px;
    height: 50px;
  }
`);
