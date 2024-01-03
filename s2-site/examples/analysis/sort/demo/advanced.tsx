import React from 'react';
import { createRoot } from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import insertCSS from 'insert-css';
import 'antd/es/cascader/style/index.css';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/21ffc284-50a2-4a30-8bb0-b2f9ac4a8fbc.json',
)
  .then((res) => res.json())
  .then((data) => {
    const defaultSortParams = [
      { sortFieldId: 'province', sortMethod: 'DESC' },
      { sortFieldId: 'type', sortBy: ['纸张', '笔'] },
      {
        sortFieldId: 'city',
        sortByMeasure: 'price',
        sortMethod: 'DESC',
      },
    ];

    const s2DataConfig = {
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

    const s2Options = {
      width: 600,
      height: 480,
    };

    const AdvancedSortDemo = () => {
      const [dataCfg, setDataCfg] = React.useState(s2DataConfig);
      const [sortParams, setSortParams] = React.useState(defaultSortParams);

      return (
        <div>
          <SheetComponent
            sheetType={'pivot'}
            adaptive={false}
            dataCfg={dataCfg}
            options={s2Options}
            header={{
              advancedSortCfg: {
                open: true,
                sortParams,
                onSortConfirm: (ruleValues, sortParams) => {
                  setDataCfg({ ...dataCfg, sortParams });
                  setSortParams(sortParams);
                },
              },
            }}
          />
        </div>
      );
    };

    createRoot(document.getElementById('container')).render(
      <AdvancedSortDemo />,
    );
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
