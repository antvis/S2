import { S2DataConfig } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Button } from 'antd';
import insertCSS from 'insert-css';
import { orderBy } from 'lodash';
import React from 'react';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    const s2DataConfig: S2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price', 'cost'],
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
      data: res,
      sortParams: [
        {
          sortFieldId: 'price',
          sortMethod: 'DESC',
        },
      ],
    };

    const App = () => {
      const [dataCfg, setDataCfg] = React.useState<S2DataConfig>(s2DataConfig);

      return (
        <>
          <Button
            onClick={() => {
              setDataCfg({
                ...dataCfg,
                sortParams: [
                  {
                    sortFieldId: 'price',
                    sortMethod: 'DESC',
                  },
                ],
              });
            }}
          >
            使用 sortMethod 排序
          </Button>
          <Button
            onClick={() => {
              setDataCfg({
                ...dataCfg,
                sortParams: [
                  {
                    sortFieldId: 'price',
                    sortMethod: 'DESC',
                    sortFunc: ({ data, sortFieldId, sortMethod }) => {
                      return orderBy(data, [sortFieldId], [sortMethod]);
                    },
                  },
                ],
              });
            }}
          >
            使用 sortFunc 自定义排序
          </Button>
          <Button
            onClick={() => {
              setDataCfg({
                ...dataCfg,
                sortParams: [
                  {
                    sortFieldId: 'city',
                    sortBy: ['白山', '长春', '杭州', '舟山'],
                  },
                ],
              });
            }}
          >
            使用 sortBy 显示指定顺序
          </Button>
          <Button
            onClick={() => {
              setDataCfg({
                ...dataCfg,
                sortParams: [
                  {
                    sortFieldId: 'price',
                    sortMethod: 'DESC',
                    query: {
                      province: '浙江',
                    },
                  },
                ],
              });
            }}
          >
            使用 query 缩小排序范围
          </Button>

          <SheetComponent
            dataCfg={dataCfg}
            options={s2Options}
            sheetType="table"
          />
        </>
      );
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<App />);
  });

// 我们用 insert-css 演示引入自定义样式
// 推荐将样式添加到自己的样式文件中
// 若拷贝官方代码，别忘了 npm install insert-css
insertCSS(`
  .ant-btn {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`);
