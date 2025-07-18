// organize-imports-ignore
import React from 'react';
import { S2DataConfig } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { Button, Menu } from 'antd';
import insertCSS from 'insert-css';
import { orderBy } from 'lodash';
import '@antv/s2-react/dist/s2-react.min.css';

fetch('https://assets.antv.antgroup.com/s2/basic-table-mode.json')
  .then((res) => res.json())
  .then((res) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      showDefaultHeaderActionIcon: true,

      /**
       * `@antv/s2` 提供组内排序的能力，如果不使用 `@antv/s2-react` 的话, 可以自行实现 Tooltip 排序菜单，然后调用相关 API.
       * 详情请查看: https://s2.antv.antgroup.com/manual/basic/sort/group
       */
      tooltip: {
        enable: true,
        operation: {
          // 开启组内排序
          sort: true,
          menu: {
            render: (props) => {
              return <Menu {...props} />;
            },
          },
        },
      },
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
