import { S2DataConfig, NODE_ID_SEPARATOR } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { InputNumber, Select, Space } from 'antd';
import insertCSS from 'insert-css';
import { every, filter, isNil, last, map, omit } from 'lodash';
import React, { useState } from 'react';

const defaultHouseInfo = {
  name: ['15#', '16#', '21#', '22#'],
  unit: ['1单元', '2单元'],
  building: [1, 2, 3, 4, 5],
  nearStreet: [true, false],
  property: ['公寓', '住宅'],
  toward: ['东', '南', '西', '北'],
  level: [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39,
  ],
  area: [92, 111, 114, 119, 120, 123, 125, 135, 138],
};

const s2Options: SheetComponentOptions = {
  width: 700,
  height: 580,
  pagination: {
    pageSize: 50,
    current: 1,
  },
  conditions: {
    // 背景 (background) 字段标记
    background: [
      {
        field: 'area',
        mapping(value) {
          if (value === 123 || value === 119) {
            return {
              // fill 是背景字段标记下唯一必须的字段，用于指定文本颜色
              fill: '#b8e1ff',
            };
          }

          return {
            fill: '#fff',
          };
        },
      },
    ],
  },
};

const defaultSortParams: S2DataConfig['sortParams'] = [
  {
    sortFieldId: 'name',
    sortMethod: 'ASC',
  },
  {
    sortFieldId: 'unit',
    sortMethod: 'ASC',
  },
  {
    sortFieldId: 'level',
    sortFunc: (params) => {
      const { data = [] } = params;

      return data.sort((a, b) => {
        const aNum = last(a.split(NODE_ID_SEPARATOR));
        const bNum = last(b.split(NODE_ID_SEPARATOR));

        return aNum - bNum;
      });
    },
  },
];
const dataConfig: S2DataConfig = {
  data: [],
  describe: '如何使用 S2 买房',
  fields: {
    rows: [
      'name',
      'unit',
      'building',
      'level',
      'nearStreet',
      'toward',
      'property',
    ],
    columns: [],
    values: ['area'],
    valueInCols: true,
  },
  meta: [
    {
      field: 'name',
      name: '楼栋',
    },
    {
      field: 'unit',
      name: '单元号',
    },
    {
      field: 'building',
      name: '房号',
    },
    {
      field: 'level',
      name: '楼层',
    },
    {
      field: 'property',
      name: '房屋类型',
    },
    {
      field: 'nearStreet',
      name: '是否临街',
    },
    {
      field: 'toward',
      name: '朝向',
    },
    {
      field: 'area',
      name: '面积',
    },
    {
      field: 'note',
      name: '备注',
    },
    {
      field: 'score',
      name: '评分',
    },
  ],
  sortParams: defaultSortParams,
};

const SelectItem = (props) => {
  const { data, dataName, onChange } = props;

  return (
    <Select
      allowClear={true}
      placeholder="全部"
      style={{ width: '150px' }}
      onChange={(value) => {
        onChange({
          key: dataName,
          value,
        });
      }}
    >
      {map(data, (item) => (
        <Select.Option key={`${item}`} value={item}>
          {`${item}`}
        </Select.Option>
      ))}
    </Select>
  );
};

const RangeSelect = (props) => {
  const { data, dataName, onChange } = props;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const [info, setInfo] = useState({ min, max });
  const handleChange = (value, key) => {
    const tempInfo = Object.assign({}, info);

    tempInfo[key] = value;
    setInfo(tempInfo);

    onChange({
      key: dataName,
      value: [tempInfo.min, tempInfo.max],
    });
  };

  return (
    <Space>
      <InputNumber
        placeholder={'最小值'}
        min={min}
        max={max}
        defaultValue={min}
        onChange={(e) => handleChange(e, 'min')}
      />
      <InputNumber
        placeholder={'最大值'}
        min={min}
        max={max}
        defaultValue={max}
        onChange={(e) => handleChange(e, 'max')}
      />
    </Space>
  );
};

const SelectList = (props) => {
  const { filterData } = props;
  const [filterInfo, setFilterInfo] = useState({});

  const onChange = ({ key, value }) => {
    let tempHouseInfo = Object.assign({}, filterInfo);

    if (isNil(value)) {
      tempHouseInfo = omit(tempHouseInfo, key);
    } else {
      tempHouseInfo[key] = value;
    }

    setFilterInfo(tempHouseInfo);
    filterData(tempHouseInfo);
  };

  return (
    <div className="select-list">
      {map(defaultHouseInfo, (item, key) => {
        return (
          <Space className="select-item" key={key}>
            <span className="select-label"> {key}</span>
            {key === 'area' || key === 'level' ? (
              <RangeSelect data={item} dataName={key} onChange={onChange} />
            ) : (
              <SelectItem data={item} dataName={key} onChange={onChange} />
            )}
          </Space>
        );
      })}
    </div>
  );
};

const Sheet = ({ data }) => {
  const [dataSource, setDataSource] = useState(data);

  const filterData = (filterInfo) => {
    const result = filter(data, (item) => {
      return every(filterInfo, (value, key) => {
        if (key === 'area') {
          return value[0] <= item.area && value[1] >= item.area;
        }

        if (key === 'level') {
          return value[0] <= item.level && value[1] >= item.level;
        }

        if (key === 'nearStreet') {
          console.log(item.nearStreet, 'item.nearStreet', value, 'value');
          console.log(item.nearStreet === value, 'item.nearStreet === value');
        }

        return item[key] === value;
      });
    });

    setDataSource(result);
  };

  return (
    <div>
      <SelectList filterData={filterData} />
      <SheetComponent
        sheetType={'pivot'}
        dataCfg={{ ...dataConfig, data: dataSource }}
        options={s2Options}
        showPagination={true}
      />
    </div>
  );
};

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/6420f338-9169-4b1f-b0f0-35f1a8295e67.json',
)
  .then((res) => res.json())
  .then((data) => {
    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<Sheet data={data} />);
  });

// We use 'insert-css' to insert custom styles
// It is recommended to add the style to your own style sheet files
// If you want to copy the code directly, please remember to install the npm package 'insert-css
insertCSS(`
  .select-item {
      margin: 5px 16px 0 0;
  }
  .select-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
  }
  .select-label {
    display: inline-block;
    width: 80px;
  }
`);
