import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import insertCss from 'insert-css';
import { SheetComponent } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';
import { Button, Checkbox, Radio } from 'antd';

const PALETTE_COLORS = [
  {
    limit: 10,
    background: '#b8e1ff',
  },
  {
    limit: 20,
    background: '#b4d3fb',
  },
  {
    limit: 30,
    background: '#7daaff',
  },
  {
    limit: 40,
    background: '#5b8ff9',
  },
  {
    limit: 50,
    background: '#3d76dd',
  },
  {
    limit: 60,
    background: '#085ec0',
  },
  {
    limit: 70,
    background: '#085ec0cc',
  },
  {
    limit: 80,
    background: '#0047a5',
  },
  {
    limit: 90,
    background: '#00318a',
  },
  {
    limit: 100,
    background: '#001d70',
  },
];


const getFormatter =
  (enablePrefix = false) =>
    (value) => {
      const suffix = value !== 0 ? '%' : '';
      return enablePrefix ? `${ value }${ suffix }` : value;
    };

const getTargetColor = (value) => {
  if (isNaN(Number(value))) {
    return PALETTE_COLORS[0].background;
  }
  return PALETTE_COLORS[Math.floor(Number(value) / 10)].background;
};

const PaletteLegend = () => {
  return (
    <div className='palette-legend'>
      <div className='palette-limit'>0%</div>
      { PALETTE_COLORS.map((color) => (
        <span
          key={ color.background }
          className='palette-color'
          style={ { background: color.background } }
        />
      )) }
      <div className='palette-limit'>100%</div>
    </div>
  );
};


const s2options = {
  width: 600,
  height: 600,
  hierarchyType: 'tree',
  tooltip: {
    operation: {
      trend: true,
      hiddenColumns: true,
    },
  },
  interaction: {
    selectedCellsSpotlight: true,
    hoverHighlight: false,
  },
  style: {
    colCfg: {
      hideMeasureColumn: true,
    },
    cellCfg: {
      width: 100,
    },
  },

};
const conditions = {
  text: [
    {
      field: 'count',
      mapping(value) {
        return {
          fill: value >= 75 ? '#fff' : '#282b32',
        };
      },
    },
  ],
  background: [
    {
      field: 'count',
      mapping(value) {
        const backgroundColor = getTargetColor(value);
        return {
          fill: backgroundColor,
        };
      },
    },
  ],
};


fetch('../data/single-population-proportion.json')
  .then((res) => res.json())
  .then(({ data }) => {
    const s2DataConfig = {
      fields: {
        rows: [ 'type', 'job' ],
        columns: [ 'age', 'city' ],
        values: [ 'count' ],
        valueInCols: true,
      },
      meta: [
        {
          field: 'type',
          name: '类别',
        },
        {
          field: 'job',
          name: '职业',
        },
        {
          field: 'age',
          name: '年龄分布',
        },
        {
          field: 'city',
          name: '所在城市',
        },
        {
          field: 'count',
          name: '数值',
        },
      ],
      data,
    };

    const ProportionSheet = (props) => {
      const { s2DataConfig, s2options, theme } = props;
      const [ options, setOptions ] = useState({ ...s2options, conditions });
      const [ dataConfig, setDataConfig ] = useState(s2DataConfig);

      const onChangeBackgroundColor = (e) => {
        console.log(`onChangeBackgroundColor = ${ e.target.checked }`);
        if (e.target.checked) {
          setOptions({
            ...options,
            conditions,
          });
        } else {
          setOptions(options);
        }
      };

      const onChangeTableState = (e) => {
        console.log(e.target.value, 'e.target.value');
        if (e.target.value === 'percent') {
          setDataConfig({
            ...s2DataConfig,
            meta: [
              ...s2DataConfig.meta,
              {
                field: 'count',
                name: '数值',
                formatter: getFormatter(true),
              },
            ],
          });
        } else {
          setDataConfig(s2DataConfig);
        }
      };

      const header = {
        title: '单人群占比表',
        exportCfg: { open: true },
        advancedSortCfg: { open: true },
        extra: [
          <Button style={ { verticalAlign: 'top' } }> 插入内容 </Button>,
          <PaletteLegend />,
          <Checkbox onChange={ onChangeBackgroundColor }>背景色</Checkbox>,
          <Radio.Group onChange={ onChangeTableState } defaultValue='count' size='small' style={ { marginTop: 16 } }>
            <Radio.Button value='count'>123 数值</Radio.Button>
            <Radio.Button value='percent'> % 占比</Radio.Button>
          </Radio.Group>,
        ],
      };


      return (
        <div className='root'>
          <SheetComponent
            dataCfg={ dataConfig }
            options={ options }
            sheetType='pivot'
            header={ header }
            adaptive={ false }
          />
        </div>
      );
    };

    ReactDOM.render(
      <ProportionSheet
        s2DataConfig={ s2DataConfig }
        s2options={ s2options }
      />,
      document.getElementById('container'),
    );
  });

insertCss(`
  .root{
    display: inline-block;
  }

  .palette-legend {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 8px;
  }

`);

