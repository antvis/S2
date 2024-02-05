import React from 'react';
import insertCSS from 'insert-css';
import { Button } from 'antd';
import {
  SheetComponent,
  SheetComponentOptions,
  SheetComponentsProps,
} from '@antv/s2-react';
import { S2DataConfig, SortParams } from '@antv/s2';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      interaction: {
        copy: { enable: true },
      },
    };

    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    const SheetHeader = () => {
      const [dataCfg, setDataCfg] = React.useState<S2DataConfig>(s2DataConfig);
      const [sortParams, setSortParams] = React.useState<SortParams>([]);
      const header: SheetComponentsProps['header'] = {
        title: '表头标题',
        description: '表头描述',
        export: { open: true },
        advancedSort: {
          open: true,
          sortParams,
          onSortConfirm: (ruleValues, sortParams) => {
            setDataCfg({ ...dataCfg, sortParams });
            setSortParams(sortParams);
          },
        },
        switcher: { open: true },
        extra: (
          <Button size={'small'} style={{ verticalAlign: 'top' }}>
            自定义按钮
          </Button>
        ),
      };

      return (
        <SheetComponent
          dataCfg={dataCfg}
          options={s2Options}
          header={header}
          adaptive={false}
        />
      );
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<SheetHeader />);
  });

insertCSS(`
  .antv-s2-header {
    margin:0px !important;
  }
`);
