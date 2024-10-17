/* eslint-disable no-console */
// organize-imports-ignore
import {
  PivotSheet,
  Node,
  S2DataConfig,
  type S2Options,
  type SortMethod,
  type SortParams,
  type TooltipOperatorMenuItem,
} from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

const SortMethodType = {
  asc: 'asc',
  desc: 'desc',
  none: 'none',
  custom: 'custom',
};

const MENUS: TooltipOperatorMenuItem<string, string>[] = [
  { key: SortMethodType.none, label: '不排序' },
  { key: SortMethodType.asc, label: '升序', icon: 'GroupAsc' },
  { key: SortMethodType.desc, label: '降序', icon: 'GroupDesc' },
  { key: SortMethodType.custom, label: '自定义排序', icon: 'Trend' },
];

const s2Options: S2Options = {
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
  // 开启 Tooltip, 自定义排序菜单
  tooltip: {
    enable: true,
  },
};

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    // 执行自定义排序回调
    const handleSort = (meta: Node, key: SortMethod) => {
      if (key === SortMethodType.custom) {
        const customSortParams: SortParams = [
          { sortFieldId: 'type', sortBy: ['办公用品', '家具'] },
          { sortFieldId: 'city', sortMethod: 'ASC' },
        ];

        console.log('可以在这里实现你手动排序的交互和逻辑哟', customSortParams);
      } else {
        // 使用 S2 提供的组内排序方式
        meta.spreadsheet.groupSortByMethod(key, meta);
      }

      meta.spreadsheet.hideTooltip();
    };

    // 设置自定义 `icon` 的展示条件
    const headerActionIcons: S2Options['headerActionIcons'] = [
      {
        // 选择 icon,可以是 S2 自带的，也可以是自定义的 icon
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

          // 自定义 tooltip 配置，展示 tooltip
          meta.spreadsheet.showTooltip({
            event,
            position: {
              x: event?.clientX || 0,
              y: event?.clientY || 0,
            },
            content(cell, defaultTooltipShowOptions) {
              console.log(cell, defaultTooltipShowOptions);
              const ul = document.createElement('ul');

              MENUS.forEach((item) => {
                const li = document.createElement('li');

                li.style.cursor = 'pointer';
                li.innerText = item.label || '';

                li.addEventListener('click', (e) => {
                  e.stopPropagation();
                  handleSort(meta, item.key as SortMethod);
                });
                ul.appendChild(li);
              });

              return ul;
            },
          });
        },
      },
    ];

    const s2 = new PivotSheet(container, s2DataConfig, {
      ...s2Options,
      headerActionIcons,
    });

    await s2.render();
  });
