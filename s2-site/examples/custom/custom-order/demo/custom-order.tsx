import React, { useEffect, useState } from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { Node, S2DataConfig, TooltipOptions } from '@antv/s2';

const SortMethodType = {
  asc: 'asc',
  desc: 'desc',
  none: 'none',
  custom: 'custom',
};

const MENUS = [
  { key: SortMethodType.none, label: '不排序' },
  { key: SortMethodType.asc, label: '升序', icon: 'GroupAsc' },
  { key: SortMethodType.desc, label: '降序', icon: 'GroupDesc' },
  { key: SortMethodType.custom, label: '自定义排序', icon: 'Trend' },
];

const s2DataConfig: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  meta: undefined,
  data: [],
};

const s2Options: SheetComponentOptions = {
  width: 600,
  height: 480,
  // 关闭默认icon
  showDefaultHeaderActionIcon: false,
  // 自定义 icon
  customSVGIcons: [
    {
      name: 'customKingIcon',
      svg: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
    },
  ],
  tooltip: {
    enable: true,
  },
};

const useDataCfg = () => {
  const [res, setRes] = useState({ meta: undefined, data: undefined });
  const [dataCfg, setDataCfg] = useState(s2DataConfig);

  useEffect(() => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
    )
      .then((res) => res.json())
      .then((res) => setRes(res));
  }, []);

  useEffect(() => {
    setDataCfg({
      ...s2DataConfig,
      meta: res.meta,
      data: res.data,
    });
  }, [res]);

  return dataCfg;
};

const App = () => {
  const dataCfg = useDataCfg();
  const [sortParams, setSortParams] = useState([]);

  // 设置自定义 `icon` 的展示条件
  const headerActionIcons: SheetComponentOptions['headerActionIcons'] = [
    {
      // 选择icon,可以是 S2 自带的，也可以是自定义的 icon
      icons: ['customKingIcon'],
      // 通过 belongsCell + displayCondition 设置 icon 的展示位置
      belongsCell: 'colCell',
      displayCondition: (meta) => meta.level === 2,
      // icon 点击之后的执行函数
      onClick: (props) => {
        const { meta, event } = props;
        const operator: TooltipOptions['operator'] = {
          menu: {
            onClick: ({ key }) => {
              handleSortCallback(meta, key);
              meta.spreadsheet.hideTooltip();
            },
            items: MENUS,
          },
        };

        // 自定义 tooltip 配置，展示 tooltip
        meta.spreadsheet.showTooltipWithInfo(event, [], {
          operator,
          onlyShowCellText: true,
          onlyShowOperator: true,
        });
      },
    },
  ];

  // 执行自定义排序回调
  const handleSortCallback = (meta: Node, key: string) => {
    if (key === SortMethodType.custom) {
      const sortParams = [
        { sortFieldId: 'type', sortBy: ['办公用品', '家具'] },
        { sortFieldId: 'city', sortMethod: 'ASC' },
      ];

      setSortParams(sortParams);
      console.log('可以在这里实现你手动排序的交互和逻辑哟', sortParams);
    } else {
      // 使用 S2 提供的组内排序方式
      meta.spreadsheet.groupSortByMethod(key, meta);
    }
  };

  return (
    <SheetComponent
      dataCfg={{ ...dataCfg, sortParams }}
      options={{ ...s2Options, headerActionIcons }}
    />
  );
};

reactDOMClient.createRoot(document.getElementById('container')).render(<App />);
