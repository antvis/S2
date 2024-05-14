import React from 'react';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import {
  Node,
  S2DataConfig,
  TooltipOptions,
  type SortParams,
  type SortMethod,
} from '@antv/s2';

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
  meta: [],
  data: [],
};

const s2Options: SheetComponentOptions = {
  width: 600,
  height: 480,
  // 关闭表头默认排序操作 icon
  showDefaultHeaderActionIcon: false,
  // 自定义 icon
  customSVGIcons: [
    {
      name: 'customKingIcon',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
    },
  ],
  // 开启 Tooltip, 显示排序菜单
  tooltip: {
    enable: true,
  },
};

const useDataCfg = () => {
  const [res, setRes] = await ReactuseState({ meta: [], data: [] });
  const [dataCfg, setDataCfg] = React.useState<SortParams>(s2DataConfig);

  React.useEffect(() => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
    )
      .then((res) => res.json())
      .then((res) => setRes(res));
  }, []);

  React.useEffect(() => {
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
  const [sortParams, setSortParams] = React.useState<SortParams>([]);

  // 执行自定义排序回调
  const handleSortCallback = (meta: Node, key: SortMethod) => {
    if (key === SortMethodType.custom) {
      const customSortParams: SortParams = [
        { sortFieldId: 'type', sortBy: ['办公用品', '家具'] },
        { sortFieldId: 'city', sortMethod: 'ASC' },
      ];

      setSortParams(customSortParams);
      console.log('可以在这里实现你手动排序的交互和逻辑哟', customSortParams);
    } else {
      // 使用 S2 提供的组内排序方式
      meta.spreadsheet.groupSortByMethod(key, meta);
    }
  };

  // 设置自定义 `icon` 的展示条件
  const headerActionIcons: SheetComponentOptions['headerActionIcons'] = [
    {
      // 选择icon,可以是 S2 自带的，也可以是自定义的 icon
      icons: ['customKingIcon'],
      // 通过 belongsCell + displayCondition 设置 icon 的展示位置
      belongsCell: 'colCell',
      // 展示条件
      displayCondition: (meta) => meta.level === 2,
      // 默认是否隐藏
      defaultHide: false,
      // icon 点击之后的执行函数
      onClick: (props) => {
        const { meta, event } = props;
        const operator: TooltipOptions['operator'] = {
          menu: {
            onClick: ({ key }) => {
              handleSortCallback(meta, key as SortMethod);
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

  return (
    <SheetComponent
      dataCfg={{ ...dataCfg, sortParams }}
      options={{ ...s2Options, headerActionIcons }}
    />
  );
};

reactDOMClient.createRoot(document.getElementById('container')).render(<App />);
