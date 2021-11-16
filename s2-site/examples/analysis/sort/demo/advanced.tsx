import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SortParams } from '@antv/s2';
import insertCss from 'insert-css';
import '@antv/s2/dist/s2.min.css';
import 'antd/dist/antd.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/6531b95e-a955-4735-91d6-e63fc32b3f34.json',
)
  .then((res) => res.json())
  .then((data) => {
    const sortParams = [
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
        values: ['price', 'cost'],
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
        {
          field: 'cost',
          name: '成本',
        },
      ],
      data,
      sortParams,
    };

    const s2Options = {
      width: 600,
      height: 480,
    };

    const AdvancedSortDemo = () => {
      const [dataCfg, setDataCfg] = useState(s2DataConfig);

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
                onSortConfirm: (ruleValues, sortParams: SortParams) => {
                  setDataCfg({ ...dataCfg, sortParams });
                },
              },
            }}
          />
        </div>
      );
    };

    ReactDOM.render(<AdvancedSortDemo />, document.getElementById('container'));
  });

insertCss(`
  .antv-s2-advanced-sort-btn.ant-btn svg path {
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .antv-s2-advanced-sort-btn.ant-btn:hover svg path, .antv-s2-advanced-sort-btn.ant-btn:focus svg path {
    fill: #873bf4;
  }
`);
