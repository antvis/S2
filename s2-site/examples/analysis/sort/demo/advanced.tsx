// organize-imports-ignore
import React from 'react';
import {S2DataConfig, SpreadSheet} from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { AdvancedSort } from '@antv/s2-react-components';
import insertCSS from 'insert-css';

import '@antv/s2-react/dist/s2-react.min.css';

fetch('https://render.alipay.com/p/yuyan/180020010001215413/s2/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const defaultSortParams: S2DataConfig['sortParams'] = [
      { sortFieldId: 'province', sortMethod: 'DESC' },
      { sortFieldId: 'type', sortBy: ['纸张', '笔'] },
      {
        sortFieldId: 'city',
        sortByMeasure: 'price',
        sortMethod: 'DESC',
      },
    ];

    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      meta: [
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '商品类别',
        },
        {
          field: 'price',
          name: '价格',
        },
      ],
      data,
      sortParams: defaultSortParams,
    };

    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    const AdvancedSortDemo = () => {
      const [dataCfg, setDataCfg] = React.useState(s2DataConfig);
      const [sheetInstance, setSheetInstance] = React.useState<SpreadSheet>();

      const onMounted = (s2: SpreadSheet) => {
        setSheetInstance(s2);
      };

      return (
        <div>
          <AdvancedSort sheetInstance={sheetInstance} onSortConfirm={(ruleValues, sortParams) => {
            setDataCfg({ ...dataCfg, sortParams });
          }} />
          <SheetComponent
            sheetType={'pivot'}
            adaptive={false}
            dataCfg={dataCfg}
            options={s2Options}
            onMounted={onMounted}
          />
        </div>
      );
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<AdvancedSortDemo />);
  });

insertCSS(`
  .antv-s2-advanced-sort-btn.ant-btn svg path {
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .antv-s2-advanced-sort-btn.ant-btn:hover svg path, .antv-s2-advanced-sort-btn.ant-btn:focus svg path {
    fill: #873bf4;
  }
  .ant-cascader-menu-item {
    font-size: 12px;
  }
  .ant-col {
    width: 100%;
  }
`);
